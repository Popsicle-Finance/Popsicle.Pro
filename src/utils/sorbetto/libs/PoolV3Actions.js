import { ethers } from "ethers";
import { CheckTicks } from "@/utils/sorbetto/libs/TicksValidation";
import { GetAmount0Delta, GetAmount1Delta } from "@/utils/sorbetto/libs/SqrtPriceMath";
import { GetSqrtRatioAtTick } from "@/utils/sorbetto/libs/TickMath";
import { AddDelta } from "@/utils/sorbetto/libs/LiquidityMath";
import { TickOutputUpdate, GetFeeGrowthInside } from "@/utils/sorbetto/libs/Tick";
import { PositionUpdate } from "@/utils/sorbetto/libs/Position";

class PoolV3Actions {
    _pool;
    _slot0;
    _liquidity;
    _currentTickInfo;
    CurrentPosition;

    constructor(pool) {
        this._pool = pool;
    }

    async Burn(tickLower, tickUpper, amount, positionOwner, time) {
        try {
            let parameters = {
                Owner: positionOwner,
                TickLower: tickLower,
                TickUpper: tickUpper,
                LiquidityDelta: amount.mul(-1)
            };

            let { position, amount0Int, amount1Int } = await this.ModifyPosition(parameters, time);
            let amount0 = amount0Int.mul(-1);
            let amount1 = amount1Int.mul(-1);

            if (amount0.gt(0) || amount1.gt(0)) {
                position.tokensOwed0 = ethers.BigNumber.from(position.tokensOwed0).add(amount0);
                position.tokensOwed1 = ethers.BigNumber.from(position.tokensOwed1).add(amount1);
            }

            this.CurrentPosition = position;

            return { token0Amount: amount0, token1Amount: amount1 };
        } catch (e) {
            console.log("Burn", e)
        }
    }

    async ModifyPosition(parameters, time) {
        try {

            CheckTicks(parameters.TickLower, parameters.TickUpper);
            //Slot0OutputDTO
            this._slot0 = await this._pool.methods.slot0().call();
            let amount0 = ethers.BigNumber.from("0");
            let amount1 = ethers.BigNumber.from("0");

            let position = await this.UpdatePosition(
                parameters.Owner,
                parameters.TickLower,
                parameters.TickUpper,
                parameters.LiquidityDelta,
                this._slot0.tick,
                time
            );


            if (!parameters.LiquidityDelta.eq(0)) {
                if (+this._slot0.tick < +parameters.TickLower) {
                    amount0 = GetAmount0Delta(
                        GetSqrtRatioAtTick(parameters.TickLower),
                        GetSqrtRatioAtTick(parameters.TickUpper),
                        ethers.BigNumber.from(parameters.LiquidityDelta));
                } else if (+this._slot0.tick < +parameters.TickUpper) {
                    const liquidityBefore = this._liquidity;

                    amount0 = GetAmount0Delta(
                        ethers.BigNumber.from(this._slot0.sqrtPriceX96),
                        GetSqrtRatioAtTick(parameters.TickUpper),
                        ethers.BigNumber.from(parameters.LiquidityDelta)
                    );

                    amount1 = GetAmount1Delta(
                        GetSqrtRatioAtTick(parameters.TickLower),
                        ethers.BigNumber.from(this._slot0.sqrtPriceX96),
                        ethers.BigNumber.from(parameters.LiquidityDelta)
                    );

                    this._liquidity = AddDelta(ethers.BigNumber.from(liquidityBefore), parameters.LiquidityDelta);
                } else {
                    amount1 = GetAmount1Delta(
                        GetSqrtRatioAtTick(parameters.TickLower),
                        GetSqrtRatioAtTick(parameters.TickUpper),
                        parameters.LiquidityDelta
                    );
                }
            }

            return { position, amount0Int: amount0, amount1Int: amount1 };
        } catch (e) {
            console.log("ModifyPosition err:", e)

        }
    }

    async UpdatePosition(owner, tickLower, tickUpper, liquidityDelta, tick, time) {
        try {
            let positionKey = this.Compute(owner, tickLower, tickUpper);
            let position = await this._pool.methods.positions(positionKey).call();
            let feeGrowthGlobal0X128 = await this._pool.methods.feeGrowthGlobal0X128().call();
            let feeGrowthGlobal1X128 = await this._pool.methods.feeGrowthGlobal1X128().call();
            let maxLiquidityPerTick = await this._pool.methods.maxLiquidityPerTick().call();
            this._liquidity = await this._pool.methods.liquidity().call();

            if (!liquidityDelta.eq(0)) {
                let { tickCumulative, secondsPerLiquidityCumulativeX128 } = await this.ObserveSinge(time, this._slot0.tick,
                    this._slot0.observationIndex, ethers.BigNumber.from(this._liquidity));

                this._currentTickInfo = await this._pool.methods.ticks(ethers.BigNumber.from(tick)).call();

                this._currentTickInfo = TickOutputUpdate(this._currentTickInfo, tickLower, tick, liquidityDelta, feeGrowthGlobal0X128,
                    feeGrowthGlobal1X128, secondsPerLiquidityCumulativeX128, tickCumulative, time, false,
                    maxLiquidityPerTick);
                this._currentTickInfo = TickOutputUpdate(this._currentTickInfo, tickUpper, tick, liquidityDelta,
                    feeGrowthGlobal0X128,
                    feeGrowthGlobal1X128, secondsPerLiquidityCumulativeX128, tickCumulative, time, true,
                    maxLiquidityPerTick);
            }



            let lowerTickInfo = await this._pool.methods.ticks(ethers.BigNumber.from(tickLower)).call();
            let upperTickInfo = await this._pool.methods.ticks(ethers.BigNumber.from(tickUpper)).call();


            let { feeGrowthInside0X128, feeGrowthInside1X128 } = GetFeeGrowthInside(lowerTickInfo, upperTickInfo, tickLower, tickUpper,
                tick, feeGrowthGlobal0X128, feeGrowthGlobal1X128);


            if (feeGrowthInside0X128.lt(0)) {
                feeGrowthInside0X128 = ethers.utils.defaultAbiCoder.encode(["int256"], [feeGrowthInside0X128]);
                feeGrowthInside0X128 = ethers.utils.defaultAbiCoder.decode(["uint256"], feeGrowthInside0X128)[0];
            }

            if (feeGrowthInside1X128.lt(0)) {
                feeGrowthInside1X128 = ethers.utils.defaultAbiCoder.encode(["int256"], [feeGrowthInside1X128]);
                feeGrowthInside1X128 = ethers.utils.defaultAbiCoder.decode(["uint256"], feeGrowthInside1X128)[0];
            }

            position = PositionUpdate(position, liquidityDelta, feeGrowthInside0X128, feeGrowthInside1X128);
            return position;
        } catch (e) {
            console.log("UpdatePosition", e)
        }
    }

    async ObserveSinge(time, tick, index, liquidity) {
        try {
            let observation = await this._pool.methods.observations(index).call();
            if (observation.BlockTimestamp != time) observation = this.Transform(observation, time, tick, liquidity);

            return {
                tickCumulative: observation.TickCumulative,
                secondsPerLiquidityCumulativeX128: observation.SecondsPerLiquidityCumulativeX128
            };
        } catch (e) {
            console.log("ERR", e)
        }



    }

    Transform(last, blockTimestamp, tick, liquidity) {
        try {
            let delta = +blockTimestamp - +last.blockTimestamp;
            liquidity = ethers.BigNumber.from(liquidity);

            let secondsPerLiquidityCumulativeX128 = ethers.BigNumber.from(last.secondsPerLiquidityCumulativeX128);
            let param1 = ethers.BigNumber.from(String(delta)).shl(128);
            let param2 = (liquidity.gt(0) ? liquidity : ethers.BigNumber.from("1"))

            return {
                BlockTimestamp: blockTimestamp,
                TickCumulative: +last.tickCumulative + +tick * delta,
                SecondsPerLiquidityCumulativeX128: secondsPerLiquidityCumulativeX128.add(param1.div(param2)),
                Initialized: true
            };
        } catch (e) {
            console.log("ERR 1", e)
        }
    }

    Compute(address, tickLower, tickUpper) {
        const encodedData = ethers.utils.solidityKeccak256(
            ["address", "int24", "int24"],
            [address, tickLower, tickUpper]
        );

        return encodedData;
    }
}

export { PoolV3Actions }
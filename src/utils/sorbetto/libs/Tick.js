import { ethers } from "ethers";
import { AddDelta } from "@/utils/sorbetto/libs/LiquidityMath";

const TickOutputUpdate = (
    info,
    tick,
    tickCurrent,
    liquidityDelta,
    feeGrowthGlobal0X128,
    feeGrowthGlobal1X128,
    secondsPerLiquidityCumulativeX128,
    tickCumulative,
    time,
    upper,
    maxLiquidity) =>
{
    let liquidityGrossBefore = ethers.BigNumber.from(info.liquidityGross);
    let liquidityGrossAfter = AddDelta(liquidityGrossBefore, liquidityDelta);

    if (liquidityGrossAfter.gt(maxLiquidity)) throw new Error("[TickOutputUpdate] Error liquidityGrossAfter > maxLiquidity");

    if (liquidityGrossBefore.eq(0)) {
        // by convention, we assume that all growth before a tick was initialized happened _below_ the tick
        if (tick <= tickCurrent) {
            info.FeeGrowthOutside0X128 = feeGrowthGlobal0X128;
            info.FeeGrowthOutside1X128 = feeGrowthGlobal1X128;
            info.SecondsPerLiquidityOutsideX128 = secondsPerLiquidityCumulativeX128;
            info.TickCumulativeOutside = tickCumulative;
            info.SecondsOutside = time;
        }
        info.Initialized = true;
    }

    info.LiquidityGross = liquidityGrossAfter;

    // when the lower (upper) tick is crossed left to right (right to left), liquidity must be added (removed)
    info.liquidityNet = upper
        ? ethers.BigNumber.from(info.liquidityNet).sub(liquidityDelta)
        : ethers.BigNumber.from(info.liquidityNet).add(liquidityDelta);
    return info;
}

const GetFeeGrowthInside = (
     lower,  upper,  tickLower,  tickUpper,  tickCurrent,  feeGrowthGlobal0X128,  feeGrowthGlobal1X128) =>
{
    let feeGrowthBelow0X128, feeGrowthBelow1X128;

    feeGrowthGlobal0X128 = ethers.BigNumber.from(feeGrowthGlobal0X128)
    feeGrowthGlobal1X128 = ethers.BigNumber.from(feeGrowthGlobal1X128)

    if (+tickCurrent >= +tickLower)
    {
        feeGrowthBelow0X128 = ethers.BigNumber.from(lower.feeGrowthOutside0X128);
        feeGrowthBelow1X128 = ethers.BigNumber.from(lower.feeGrowthOutside1X128);
    }
    else
    {
        feeGrowthBelow0X128 = feeGrowthGlobal0X128.sub(ethers.BigNumber.from(lower.feeGrowthOutside0X128));
        feeGrowthBelow1X128 = feeGrowthGlobal1X128.sub(ethers.BigNumber.from(lower.feeGrowthOutside1X128));
    }
    
    let feeGrowthAbove0X128, feeGrowthAbove1X128;

    if (+tickCurrent < +tickUpper)
    {
        feeGrowthAbove0X128 = ethers.BigNumber.from(upper.feeGrowthOutside0X128);
        feeGrowthAbove1X128 = ethers.BigNumber.from(upper.feeGrowthOutside1X128);
    }
    else
    {
        feeGrowthAbove0X128 = feeGrowthGlobal0X128.sub(ethers.BigNumber.from(upper.feeGrowthOutside0X128));
        feeGrowthAbove1X128 = feeGrowthGlobal1X128.sub(ethers.BigNumber.from(upper.feeGrowthOutside1X128));
    }

    var feeGrowthInside0X128 = feeGrowthGlobal0X128.sub(feeGrowthBelow0X128).sub(feeGrowthAbove0X128);
    var feeGrowthInside1X128 = feeGrowthGlobal1X128.sub(feeGrowthBelow1X128).sub(feeGrowthAbove1X128);

    return { feeGrowthInside0X128, feeGrowthInside1X128 };
}

export { TickOutputUpdate, GetFeeGrowthInside }
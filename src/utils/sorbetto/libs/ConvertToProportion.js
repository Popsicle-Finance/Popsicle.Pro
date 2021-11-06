import { ethers } from "ethers";
import { GetLiquidityForAmount0, GetLiquidityForAmount1, GetAmountsForLiquidity } from "@/utils/sorbetto/libs/LiquidityAmounts";
import { GetSqrtRatioAtTick } from "@/utils/sorbetto/libs/TickMath";

const ConvertToProportion = async (desired0, desired1, fragolaContract, poolContract) => {

    desired0 = ethers.BigNumber.from(desired0);
    desired1 = ethers.BigNumber.from(desired1);

    let tickLower = await fragolaContract.methods.tickLower().call();
    let tickUpper = await fragolaContract.methods.tickUpper().call();

    let slot0 = await poolContract.methods.slot0().call();
    let sqrtRatioX = ethers.BigNumber.from(slot0.sqrtPriceX96);

    let sqrtRatioAX96 = GetSqrtRatioAtTick(tickLower);
    let sqrtRatioBX96 = GetSqrtRatioAtTick(tickUpper);

    let desiredLiquidity = GetLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, desired0).add(GetLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, desired1));

    let { amount0, amount1} = GetAmountsForLiquidity(
        sqrtRatioX,
        GetSqrtRatioAtTick(tickLower),
        GetSqrtRatioAtTick(tickUpper),
        desiredLiquidity
    );

    return { amount0: amount0.toString(), amount1: amount1.toString()};
}

export { ConvertToProportion }
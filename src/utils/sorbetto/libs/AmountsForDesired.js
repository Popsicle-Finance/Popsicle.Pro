import { ethers } from "ethers";
import { GetLiquidityForAmounts, GetAmountsForLiquidity } from "@/utils/sorbetto/libs/LiquidityAmounts";
import { GetSqrtRatioAtTick } from "@/utils/sorbetto/libs/TickMath";

const GetAmountForDesired = async (desired0, desired1, fragolaContract, poolContract) => {
    desired0 = ethers.BigNumber.from(desired0);
    desired1 = ethers.BigNumber.from(desired1);


    let tickLower = await fragolaContract.methods.tickLower().call();
    let tickUpper = await fragolaContract.methods.tickUpper().call();

    let slot0 = await poolContract.methods.slot0().call();
    let sqrtRatioX = ethers.BigNumber.from(slot0.sqrtPriceX96);

    let liquidity = GetLiquidityForAmounts(
        sqrtRatioX,
        GetSqrtRatioAtTick(tickLower),
        GetSqrtRatioAtTick(tickUpper),
        desired0,
        desired1
    );

    let { amount0, amount1 } = GetAmountsForLiquidity(
        sqrtRatioX,
        GetSqrtRatioAtTick(tickLower),
        GetSqrtRatioAtTick(tickUpper),
        liquidity
    );

    return { amount0: amount0.toString(), amount1: amount1.toString()};
}

export { GetAmountForDesired }
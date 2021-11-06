import { ethers } from "ethers";
import { Q96, RESOLUTION } from "@/utils/sorbetto/libs/Constants";
import { MulDiv } from "@/utils/sorbetto/libs/FullMath";


const GetLiquidityForAmount0 = (sqrtRatioAX96, sqrtRatioBX96, amount0) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96 , sqrtRatioAX96];

    let intermediate = MulDiv(sqrtRatioAX96, sqrtRatioBX96, Q96);
    return MulDiv(amount0, intermediate, sqrtRatioBX96.sub(sqrtRatioAX96));
}

const GetLiquidityForAmount1 = (sqrtRatioAX96, sqrtRatioBX96, amount1) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    return MulDiv(amount1, Q96, sqrtRatioBX96.sub(sqrtRatioAX96));
}

const GetLiquidityForAmounts = ( sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1) => {
    let liquidity = ethers.BigNumber.from("0");

    if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];

    if (sqrtRatioX96.lte(sqrtRatioAX96)) {
        liquidity = GetLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
    } else if (sqrtRatioX96.lt(sqrtRatioBX96)) {
        var liquidity0 = GetLiquidityForAmount0(sqrtRatioX96, sqrtRatioBX96, amount0);
        var liquidity1 = GetLiquidityForAmount1(sqrtRatioAX96, sqrtRatioX96, amount1);

        liquidity = liquidity0.lt(liquidity1) ? liquidity0 : liquidity1;
    } else {
        liquidity = GetLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
    }

    return liquidity;
}

const GetAmountsForLiquidity = (sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, liquidity) => {

    let amount0 = ethers.BigNumber.from("0");
    let amount1 = ethers.BigNumber.from("0");

    if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];

    if (sqrtRatioX96.lte(sqrtRatioAX96)){
        amount0 = GetAmount0ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
    } else if (sqrtRatioX96.lt(sqrtRatioBX96)){
        amount0 = GetAmount0ForLiquidity(sqrtRatioX96, sqrtRatioBX96, liquidity);
        amount1 = GetAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioX96, liquidity);
    } else {
        amount1 = GetAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
    }

    return {amount0, amount1};
}

const GetAmount0ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];

    const MulDivResult = MulDiv(
        liquidity.shl(RESOLUTION),
        sqrtRatioBX96.sub(sqrtRatioAX96),
        sqrtRatioBX96
    )

    return MulDivResult.div(sqrtRatioAX96);
}

const GetAmount1ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    return MulDiv(liquidity, sqrtRatioBX96.sub(sqrtRatioAX96), Q96);
}

export {
    GetLiquidityForAmount0,
    GetLiquidityForAmount1,
    GetLiquidityForAmounts,
    GetAmountsForLiquidity,
    GetAmount0ForLiquidity,
    GetAmount1ForLiquidity
}
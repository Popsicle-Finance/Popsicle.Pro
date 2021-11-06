import { RESOLUTION } from "@/utils/sorbetto/libs/Constants";
import { MulDiv, MulDivRoundingUp } from "@/utils/sorbetto/libs/FullMath";
import { Q96 } from "@/utils/sorbetto/libs/Constants";
import { DivRoundingUp } from "@/utils/sorbetto/libs/UnsafeMath";

const GetAmount0Delta = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    return liquidity.lt(0)
            ? GetAmount0DeltaFinal(sqrtRatioAX96, sqrtRatioBX96, liquidity.mul(-1), false).mul(-1)
            : GetAmount0DeltaFinal(sqrtRatioAX96, sqrtRatioBX96, liquidity, true);
}

const GetAmount0DeltaFinal = (sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) => {

    if(sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    let numerator1 = liquidity.shl(RESOLUTION);
    let numerator2 = sqrtRatioBX96.sub(sqrtRatioAX96);

    if (sqrtRatioAX96.lte(0)) throw new Error("[GetAmount0Delta] Error sqrtRatioAX96 <= 0");
    let amount0Delta = MulDiv(numerator1, numerator2, sqrtRatioBX96).div(sqrtRatioAX96);
    
    return roundUp
            ? DivRoundingUp(MulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), sqrtRatioAX96)
            : amount0Delta;
}

const GetAmount1Delta = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    return liquidity.lt(0)
            ? GetAmount1DeltaFinal(sqrtRatioAX96, sqrtRatioBX96, liquidity.mul(-1), false).mul(-1)
            : GetAmount1DeltaFinal(sqrtRatioAX96, sqrtRatioBX96, liquidity, true);
}

const GetAmount1DeltaFinal = (sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];

    return roundUp
            ? MulDivRoundingUp(liquidity, sqrtRatioBX96.sub(sqrtRatioAX96), Q96)
            : MulDiv(liquidity, sqrtRatioBX96.sub(sqrtRatioAX96), Q96);
}

export { GetAmount0Delta, GetAmount0DeltaFinal, GetAmount1Delta, GetAmount1DeltaFinal }

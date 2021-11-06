import { ethers } from "ethers";


const MAX_VALUE_HEX = process.env.VUE_APP_MAX_VALUE_HEX;

const Q128 = ethers.BigNumber.from("0x100000000000000000000000000000000");
const Q96 = ethers.BigNumber.from("0x1000000000000000000000000");

const RESOLUTION = 96;

const MinTick = -887272;
const MaxTick = -MinTick;

const TicksOutputDTO = class
{
    constructor(LiquidityGross, LiquidityNet, FeeGrowthOutside0X128, FeeGrowthOutside1X128, TickCumulativeOutside, SecondsPerLiquidityOutsideX128, SecondsOutside, Initialized) {
        this.LiquidityGross = ethers.BigNumber.from(LiquidityGross);
        this.LiquidityNet = ethers.BigNumber.from(LiquidityNet);
        this.FeeGrowthOutside0X128 = ethers.BigNumber.from(FeeGrowthOutside0X128);
        this.FeeGrowthOutside1X128 = ethers.BigNumber.from(FeeGrowthOutside1X128);
        this.TickCumulativeOutside = ethers.BigNumber.from(TickCumulativeOutside);
        this.SecondsPerLiquidityOutsideX128 = ethers.BigNumber.from(SecondsPerLiquidityOutsideX128);
        this.SecondsOutside = SecondsOutside
        this.Initialized  = Initialized
    }
}

const DivRoundingUp = (x, y) => {
    let z = x.div(y);
    if (x.mod(y).gt(0))
        z = z.add(1);
    return z;
}

const MulDiv = ( a,  b, denominator) => {
    if (denominator.lte(0)) return "[MulDiv] Denominator is zero";

    let c = a.mul(b);
    return c.div(denominator);
}

const MulDivRoundingUp = (a, b, denominator) => {
    let result = MulDiv(a, b, denominator);
    // ReSharper disable once InvertIf
    if (a.mul(b).mod(denominator).gt(0))
    {
        result = result.add(1);
    }

    return result;
}

const AddDelta = (x, y) => {
    if (y.lt(0)){
        var z = x.sub(y.mul(-1));
        if (z.gte(x)) throw new Error("[AddDelta] Error z > x") 
        return z;
    } else {
        var z = x.add(y);
        if (z.lt(x)) throw new Error("[AddDelta] Error z < x") 
        return z;
    }
}

const CheckTick = (tick) =>{
    if (tick >= MinTick && tick <= MaxTick) {
        return true;
    }

    throw new Error("[CheckTick] Error Tick out ou range") 
}

const CheckTicks = ( tickLower,  tickUpper) => {
    if (tickLower >= tickUpper) throw new Error("[CheckTick] Error tickLower > tickUpper");
    if (tickLower < MinTick) throw new Error("[CheckTick] Error tickLower < MinTick");
    if (tickUpper > MaxTick) throw new Error("[CheckTick] Error tickUpper < MaxTick");

    return true;
}

const GetSqrtRatioAtTick = (tick) => {
    if(!CheckTick(tick)) throw new Error("[GetSqrtRatioAtTick] Error CheckTick error");;
    // ReSharper disable once IntVariableOverflowInUncheckedContext
    let absTick = tick < 0 ? tick * -1 : tick;

    if (absTick > MaxTick) throw new Error("[GetSqrtRatioAtTick] Error absTick > MaxTick");

    let ratio = (absTick & 1) != 0
        ? ethers.BigNumber.from("0xfffcb933bd6fad37aa2d162d1a594001")
        : ethers.BigNumber.from("0x100000000000000000000000000000000");

    if ((absTick & 0x2) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xfff97272373d413259a46990580e213a"))).shr(128);
    if ((absTick & 0x4) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xfff2e50f5f656932ef12357cf3c7fdcc"))).shr(128);
    if ((absTick & 0x8) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xffe5caca7e10e4e61c3624eaa0941cd0"))).shr(128);
    if ((absTick & 0x10) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xffcb9843d60f6159c9db58835c926644"))).shr(128);
    if ((absTick & 0x20) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xff973b41fa98c081472e6896dfb254c0"))).shr(128);
    if ((absTick & 0x40) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xff2ea16466c96a3843ec78b326b52861"))).shr(128);
    if ((absTick & 0x80) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xfe5dee046a99a2a811c461f1969c3053"))).shr(128);
    if ((absTick & 0x100) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xfcbe86c7900a88aedcffc83b479aa3a4"))).shr(128);
    if ((absTick & 0x200) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xf987a7253ac413176f2b074cf7815e54"))).shr(128);
    if ((absTick & 0x400) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xf3392b0822b70005940c7a398e4b70f3"))).shr(128);
    if ((absTick & 0x800) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xe7159475a2c29b7443b29c7fa6e889d9"))).shr(128);
    if ((absTick & 0x1000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xd097f3bdfd2022b8845ad8f792aa5825"))).shr(128);
    if ((absTick & 0x2000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xa9f746462d870fdf8a65dc1f90e061e5"))).shr(128);
    if ((absTick & 0x4000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x70d869a156d2a1b890bb3df62baf32f7"))).shr(128);
    if ((absTick & 0x8000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x31be135f97d08fd981231505542fcfa6"))).shr(128);
    if ((absTick & 0x10000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x9aa508b5b7a84e1c677de54f3e99bc9"))).shr(128);
    if ((absTick & 0x20000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x5d6af8dedb81196699c329225ee604"))).shr(128);
    if ((absTick & 0x40000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x2216e584f5fa1ea926041bedfe98"))).shr(128);
    if ((absTick & 0x80000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x48a170391f7dc42444e8fa2"))).shr(128);

    if (tick > 0) ratio = ethers.BigNumber.from(MAX_VALUE_HEX).div(ratio);

    // this divides by 1<<32 rounding up to go from a Q128.128 to a Q128.96.
    // we then downcast because we know the result always fits within 160 bits due to our tick input constraint
    // we round up in the division so getTickAtSqrtRatio of the output price is always consistent

    const Q32 = ethers.BigNumber.from("1").shl(32);

    return ratio.shr(32).add((ratio.mod(Q32).eq(ethers.BigNumber.from("0")) ? ethers.BigNumber.from("0") : ethers.BigNumber.from("1")));
}

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
    let liquidityGrossBefore = info.LiquidityGross;
    let liquidityGrossAfter = AddDelta(liquidityGrossBefore, liquidityDelta);

    if (liquidityGrossAfter.gt(maxLiquidity)) throw new Error("[TickOutputUpdate] Error liquidityGrossAfter > maxLiquidity");

    if (liquidityGrossBefore.eq(0)) {
        // by convention, we assume that all growth before a tick was initialized happened _below_ the tick
        if (tick.lte(tickCurrent)) {
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
    info.LiquidityNet = upper
        ? info.LiquidityNet.sub(liquidityDelta)
        : info.LiquidityNet.add(liquidityDelta);
    return info;
}

const GetFeeGrowthInside = (
     lower,  upper,  tickLower,  tickUpper,  tickCurrent,  feeGrowthGlobal0X128,  feeGrowthGlobal1X128) =>
{
    let feeGrowthBelow0X128, feeGrowthBelow1X128;

    if (tickCurrent >= tickLower)
    {
        feeGrowthBelow0X128 = lower.FeeGrowthOutside0X128;
        feeGrowthBelow1X128 = lower.FeeGrowthOutside1X128;
    }
    else
    {
        feeGrowthBelow0X128 = feeGrowthGlobal0X128.sub(lower.FeeGrowthOutside0X128);
        feeGrowthBelow1X128 = feeGrowthGlobal1X128.sub(lower.FeeGrowthOutside1X128);
    }
    
    let feeGrowthAbove0X128, feeGrowthAbove1X128;

    if (tickCurrent < tickUpper)
    {
        feeGrowthAbove0X128 = upper.FeeGrowthOutside0X128;
        feeGrowthAbove1X128 = upper.FeeGrowthOutside1X128;
    }
    else
    {
        feeGrowthAbove0X128 = feeGrowthGlobal0X128.sub(upper.FeeGrowthOutside0X128);
        feeGrowthAbove1X128 = feeGrowthGlobal1X128.sub(upper.FeeGrowthOutside1X128);
    }

    var feeGrowthInside0X128 = feeGrowthGlobal0X128.sub(feeGrowthBelow0X128).sub(feeGrowthAbove0X128);
    var feeGrowthInside1X128 = feeGrowthGlobal1X128.sub(feeGrowthBelow1X128).sub(feeGrowthAbove1X128);
    return {feeGrowthInside0X128, feeGrowthInside1X128};
}


//
// LiquidityAmounts
//


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

    return MulDivResult.mul(sqrtRatioAX96);
}

const GetAmount1ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    return MulDiv(liquidity, sqrtRatioBX96.sub(sqrtRatioAX96), Q96);
}


//
// SqrtPriceMath
//


const GetAmount0Delta = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    return liquidity.lt(0)
            ? GetAmount0DeltaFinal(sqrtRatioAX96, sqrtRatioBX96, -liquidity, false).mul(-1)
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
            ? GetAmount1DeltaFinal(sqrtRatioAX96, sqrtRatioBX96, -liquidity, false).mul(-1)
            : GetAmount1DeltaFinal(sqrtRatioAX96, sqrtRatioBX96, liquidity, true);
}

const GetAmount1DeltaFinal = (sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];

    return roundUp
            ? MulDivRoundingUp(liquidity, sqrtRatioBX96.sub(sqrtRatioAX96), Q96)
            : MulDiv(liquidity, sqrtRatioBX96.sub(sqrtRatioAX96), Q96);
}


//
// Position
//


const PositionUpdate = ( self, liquidityDelta, feeGrowthInside0X128, feeGrowthInside1X128) => {
    let _self = self;

    let liquidityNext;

    if (liquidityDelta.eq(0)){
        if (_self.Liquidity.lte(0)) throw new Error("[PositionUpdate] Error Liquidity <= 0");
        liquidityNext = _self.Liquidity;
    } else {
        liquidityNext = AddDelta(_self.Liquidity, liquidityDelta);
    }

    // calculate accumulated fees
    let deltafee0 = feeGrowthInside0X128.sub(_self.FeeGrowthInside0LastX128);
    let deltafee1 = feeGrowthInside1X128.sub(_self.FeeGrowthInside1LastX128);

    if (deltafee0.lt(0)) {
        deltafee0 = ethers.BigNumber.from(MAX_VALUE_HEX).add(feeGrowthInside0X128).sub(_self.FeeGrowthInside0LastX128).add(1);
    }

    if (deltafee1.lt(0)){
        deltafee0 = ethers.BigNumber.from(MAX_VALUE_HEX).add(feeGrowthInside1X128).sub(_self.FeeGrowthInside1LastX128).add(1);
    }

    let tokensOwed0 = MulDiv(deltafee0, _self.Liquidity, Q128);
    let tokensOwed1 = MulDiv(deltafee1, _self.Liquidity, Q128);
    
    if (!liquidityDelta.eq(0)) self.Liquidity = liquidityNext;
    self.FeeGrowthInside0LastX128 = feeGrowthInside0X128;
    self.FeeGrowthInside1LastX128 = feeGrowthInside1X128;

    if (tokensOwed0.lte(0) && tokensOwed1.lte(0)) return self;

    // overflow is acceptable, have to withdraw before you hit type(uint128).max fees
    self.TokensOwed0 = self.TokensOwed0.add(tokensOwed0);
    self.TokensOwed1 = self.TokensOwed1.add(tokensOwed1);
    return self;
}

export {Q128, Q96, RESOLUTION, DivRoundingUp, MulDiv, MulDivRoundingUp, AddDelta,
    MinTick, MaxTick, CheckTick, CheckTicks, GetSqrtRatioAtTick, TicksOutputDTO, 
    TickOutputUpdate, GetFeeGrowthInside, GetLiquidityForAmount0, GetLiquidityForAmount1, 
    GetLiquidityForAmounts, GetAmountsForLiquidity, GetAmount0ForLiquidity, GetAmount1ForLiquidity,
    GetAmount0Delta, GetAmount0DeltaFinal, GetAmount1Delta, GetAmount1DeltaFinal,
    PositionUpdate}
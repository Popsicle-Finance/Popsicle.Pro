import { ethers } from "ethers";

const TicksOutputDTO = class {
    constructor(LiquidityGross, LiquidityNet, FeeGrowthOutside0X128, FeeGrowthOutside1X128, TickCumulativeOutside, SecondsPerLiquidityOutsideX128, SecondsOutside, Initialized) {
        this.LiquidityGross = ethers.BigNumber.from(LiquidityGross);
        this.LiquidityNet = ethers.BigNumber.from(LiquidityNet);
        this.FeeGrowthOutside0X128 = ethers.BigNumber.from(FeeGrowthOutside0X128);
        this.FeeGrowthOutside1X128 = ethers.BigNumber.from(FeeGrowthOutside1X128);
        this.TickCumulativeOutside = ethers.BigNumber.from(TickCumulativeOutside);
        this.SecondsPerLiquidityOutsideX128 = ethers.BigNumber.from(SecondsPerLiquidityOutsideX128);
        this.SecondsOutside = SecondsOutside
        this.Initialized = Initialized
    }
}

export default TicksOutputDTO;
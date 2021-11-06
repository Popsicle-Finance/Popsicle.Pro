import { ethers } from "ethers";
import { MAX_VALUE_HEX, Q128 } from "@/utils/sorbetto/libs/Constants";
import { AddDelta } from "@/utils/sorbetto/libs/LiquidityMath";
import { MulDiv } from "@/utils/sorbetto/libs/FullMath";

const PositionUpdate = ( self, liquidityDelta, feeGrowthInside0X128, feeGrowthInside1X128 ) => {
    try {
        let _self = self;

        let liquidityNext;
    
    
        if (liquidityDelta.eq(0)){
            if (ethers.BigNumber.from(_self.liquidity).lte(0)) throw new Error("[PositionUpdate] Error Liquidity <= 0");
            liquidityNext = ethers.BigNumber.from(_self.liquidity)
        } else {
            liquidityNext = AddDelta(ethers.BigNumber.from(_self.liquidity), liquidityDelta);
        }
    
        // calculate accumulated fees
        let deltafee0 = feeGrowthInside0X128.sub(ethers.BigNumber.from(_self.feeGrowthInside0LastX128));
        let deltafee1 = feeGrowthInside1X128.sub(ethers.BigNumber.from(_self.feeGrowthInside1LastX128));

        if (deltafee0.lt(0)) {
            deltafee0 = ethers.BigNumber.from(MAX_VALUE_HEX).add(feeGrowthInside0X128).sub(ethers.BigNumber.from(_self.feeGrowthInside0LastX128)).add(1);
        }
    
        if (deltafee1.lt(0)){
            deltafee0 = ethers.BigNumber.from(MAX_VALUE_HEX).add(feeGrowthInside1X128).sub(ethers.BigNumber.from(_self.feeGrowthInside1LastX128)).add(1);
        }
    
        let tokensOwed0 = MulDiv(deltafee0, ethers.BigNumber.from(_self.liquidity), Q128);
        let tokensOwed1 = MulDiv(deltafee1, ethers.BigNumber.from(_self.liquidity), Q128);
        
        if (!liquidityDelta.eq(0)) self.liquidity = liquidityNext;
        self.feeGrowthInside0LastX128 = feeGrowthInside0X128;
        self.feeGrowthInside1LastX128 = feeGrowthInside1X128;
    
        if (tokensOwed0.lte(0) && tokensOwed1.lte(0)) return self;
    
        // overflow is acceptable, have to withdraw before you hit type(uint128).max fees
        self.tokensOwed0 = ethers.BigNumber.from(self.tokensOwed0).add(tokensOwed0);
        self.tokensOwed1 = ethers.BigNumber.from(self.tokensOwed1).add(tokensOwed1);
        return self;
    } catch(e) {
        console.log("PositionUpdate", e)
    }
}

export { PositionUpdate }
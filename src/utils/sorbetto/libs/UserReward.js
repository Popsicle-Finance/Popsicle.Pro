import { ethers } from "ethers";

const GetUserPendingRewards = async (userAddress, fragolaService, zeroPokeAmount0, zeroPokeAmount1) => {

    let token0PerLpStored = await fragolaService.methods.token0PerShareStored().call();
    let token1PerLpStored = await fragolaService.methods.token1PerShareStored().call();
    let totalSupply = await fragolaService.methods.totalSupply().call();

    token0PerLpStored = ethers.BigNumber.from(token0PerLpStored);
    token1PerLpStored = ethers.BigNumber.from(token1PerLpStored);
    totalSupply = ethers.BigNumber.from(totalSupply);

    token0PerLpStored = TokenPerShare(zeroPokeAmount0, token0PerLpStored, totalSupply);
    token1PerLpStored = TokenPerShare(zeroPokeAmount1, token1PerLpStored, totalSupply);

    let userBalance = await fragolaService.methods.balanceOf(userAddress).call();

    userBalance = ethers.BigNumber.from(userBalance);

    let userInfo = await fragolaService.methods.userInfo(userAddress).call();

    const token0PerSharePaid = ethers.BigNumber.from(userInfo.token0PerSharePaid);
    const token0Rewards = ethers.BigNumber.from(userInfo.token0Rewards);

    const token1PerSharePaid = ethers.BigNumber.from(userInfo.token1PerSharePaid);
    const token1Rewards = ethers.BigNumber.from(userInfo.token1Rewards);

    const token0RewardsFinal = FeeEarned(token0PerLpStored, userBalance, token0PerSharePaid, token0Rewards);

    const token1RewardsFinal = FeeEarned(token1PerLpStored, userBalance, token1PerSharePaid, token1Rewards);
    
    return { token0Rewards: token0RewardsFinal.toString(), token1Rewards: token1RewardsFinal.toString() }
}

const TokenPerShare = (collected, tokenPerLpStored, totalSupply) => {
    collected = ethers.BigNumber.from(collected);
    tokenPerLpStored = ethers.BigNumber.from(tokenPerLpStored);
    totalSupply = ethers.BigNumber.from(totalSupply);

    if (totalSupply.gt(0)) {
        const decimalsBn = ethers.utils.parseUnits('1', 18);

        return tokenPerLpStored.add(collected.mul(decimalsBn).div(totalSupply));
    }

    return tokenPerLpStored;
}

const FeeEarned = (fee0PerShare, userBalance, tokenPerSharePaid, tokenRewards) => {
    const decimalsBn = ethers.utils.parseUnits('1', 18);

    return tokenRewards.add(userBalance.mul(fee0PerShare.sub(tokenPerSharePaid)).div(decimalsBn));
}

export { GetUserPendingRewards }
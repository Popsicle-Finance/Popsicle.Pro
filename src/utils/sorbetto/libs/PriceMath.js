const Token0ValuePrice = (sqrtPriceX96, token0Power) => {
    const multiplyResult = sqrtPriceX96.mul(sqrtPriceX96).mul(token0Power)

    return multiplyResult.shr(96 * 2);
}

export { Token0ValuePrice }
const MulDiv = ( a,  b, denominator) => {
    if (denominator.lte(0)) return "[MulDiv] Denominator is zero";

    let c = a.mul(b);
    return c.div(denominator);
}

const MulDivRoundingUp = (a, b, denominator) => {
    let result = MulDiv(a, b, denominator);
    // ReSharper disable once InvertIf
    if (a.mul(b).mod(denominator).gt(0)) {
        result = result.add(1);
    }

    return result;
}

export { MulDiv, MulDivRoundingUp }
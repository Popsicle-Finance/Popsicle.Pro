const DivRoundingUp = (x, y) => {
    let z = x.div(y);
    if (x.mod(y).gt(0))
        z = z.add(1);
    return z;
}

export { DivRoundingUp }
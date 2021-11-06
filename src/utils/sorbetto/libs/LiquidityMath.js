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

export { AddDelta }
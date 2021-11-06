import { MIN_TICK, MAX_TICK } from "@/utils/sorbetto/libs/Constants";

const CheckTick = (tick) =>{
    if (tick >= MIN_TICK && tick <= MAX_TICK) {
        return true;
    }

    throw new Error("[CheckTick] Error Tick out ou range") 
}

const CheckTicks = ( tickLower,  tickUpper) => {
    if (+tickLower >= +tickUpper) throw new Error("[CheckTick] Error tickLower > tickUpper");
    if (+tickLower < MIN_TICK) throw new Error("[CheckTick] Error tickLower < MIN_TICK");
    if (+tickUpper > MAX_TICK) throw new Error("[CheckTick] Error tickUpper < MAX_TICK");

    return true;
}

export { CheckTick, CheckTicks }
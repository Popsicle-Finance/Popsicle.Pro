import { ethers } from "ethers";

const MAX_VALUE_HEX = process.env.VUE_APP_MAX_VALUE_HEX;

const Q128 = ethers.BigNumber.from("0x100000000000000000000000000000000");
const Q96 = ethers.BigNumber.from("0x1000000000000000000000000");

const RESOLUTION = 96;

const MIN_TICK = -887272;
const MAX_TICK = -MIN_TICK;

export {MAX_VALUE_HEX, Q128, Q96, RESOLUTION, MIN_TICK, MAX_TICK}
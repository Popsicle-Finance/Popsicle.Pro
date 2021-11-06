// import { ethers } from "ethers";
// import { GetSqrtRatioAtTick } from "@/utils/sorbetto/libs/TickMath";
// import { GetLiquidityForAmount0 } from "@/utils/sorbetto/libs/LiquidityAmounts";
// import { Q128 } from "@/utils/sorbetto/libs/Constants";

// const GetApy = async (poolContract, fragolaContract, token0Price, token1Price, token0Decimals, token1Decimals) => {

//     let fee0Current = await poolContract.feeGrowthGlobal0X128().call();
//     let fee1Current = await poolContract.feeGrowthGlobal1X128().call();
//     let token0 = await poolContract.token0().call();
//     let token1 = await poolContract.token1().call();


//     token0 = token0.ConvertToEthereumChecksumAddress();
//     token1 = token1.ConvertToEthereumChecksumAddress();


//     let coin0 = Models.SorbettoService.Static.SupportedCoins[token0];
//     let coin1 = Models.SorbettoService.Static.SupportedCoins[token1];


//     let usdToTokenZeroPrice = +token0Price != 0 ? 1 / token0Price : 0;
//     let token0AmountDec = usdToTokenZeroPrice * 1000;

//     let token0Amount = Web3.Convert.ToWei(token0AmountDec, coin0.DecimalPow);

//     let tickLower = await fragolaContract.methods.tickLower().call();
//     let tickUpper = await fragolaContract.methods.tickUpper().call();


//     let sqrtRatioAX96 = GetSqrtRatioAtTick(tickLower);
//     let sqrtRatioBX96 = GetSqrtRatioAtTick(tickUpper);

//     let desiredLiquidity = GetLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, token0Amount);
   
//     let subFee0 = fee0Current -
//                   Models.SorbettoService.Static.FeeGlobalPool[pair.Value].FeeGrowthGlobal0X128Past;
//     let subFee1 = fee1Current -
//                   Models.SorbettoService.Static.FeeGlobalPool[pair.Value].FeeGrowthGlobal1X128Past;

//     let fee0PerDay = subFee0 * desiredLiquidity / Q128;
//     let fee1PerDay = subFee1 * desiredLiquidity / Q128;
//     let fee0decimal =
//         Web3.Convert.FromWei(fee0PerDay,
//             coin0.DecimalPow);
//     let fee1decimal =
//         Web3.Convert.FromWei(fee1PerDay,
//             token1Decimals);

//     let fee0InUsd = fee0decimal * coin0.Usd;
//     let fee1InUsd = fee1decimal * coin1.Usd;

//     let sumFee = fee0InUsd + fee1InUsd;
//     let daysInYear = 365;
//     let apr = sumFee / 1000 * daysInYear;
    
    
//     return APR = decimal.Round(apr * 100, 2),
// }
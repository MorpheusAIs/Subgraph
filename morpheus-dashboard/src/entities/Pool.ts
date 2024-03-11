import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Pool } from "../../generated/schema";

export function getPool(
  poolId: BigInt,
  payoutStart: BigInt = BigInt.zero(),
  decreaseInterval: BigInt = BigInt.zero(),
  withdrawLockPeriod: BigInt = BigInt.zero(),
  claimLockPeriod: BigInt = BigInt.zero(),
  withdrawLockPeriodAfterStake: BigInt = BigInt.zero(),
  initialReward: BigInt = BigInt.zero(),
  rewardDecrease: BigInt = BigInt.zero(),
  minimalStake: BigInt = BigInt.zero(),
  isPublic: boolean = false,
): Pool {
  let id = Bytes.fromByteArray(Bytes.fromBigInt(poolId));

  let pool = Pool.load(id);

  if (pool == null) {
    pool = new Pool(id);

    pool.payoutStart = payoutStart;
    pool.decreaseInterval = decreaseInterval;
    pool.withdrawLockPeriod = withdrawLockPeriod;
    pool.claimLockPeriod = claimLockPeriod;
    pool.withdrawLockPeriodAfterStake = withdrawLockPeriodAfterStake;
    pool.initialReward = initialReward;
    pool.rewardDecrease = rewardDecrease;
    pool.minimalStake = minimalStake;
    pool.isPublic = isPublic;

    pool.totalUsers = BigInt.zero();
    pool.totalStaked = BigInt.zero();
  }

  return pool;
}

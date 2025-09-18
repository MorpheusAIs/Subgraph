import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { DepositPool } from "../../generated/schema";

export function getDepositPool(rewardPoolId: BigInt, depositPool: Address): DepositPool {
  let id = Bytes.fromByteArray(Bytes.fromBigInt(rewardPoolId)).concat(depositPool);

  let pool = DepositPool.load(id);

  if (pool == null) {
    pool = new DepositPool(id);

    pool.rewardPoolId = rewardPoolId;
    pool.depositPool = depositPool;

    pool.totalStaked = BigInt.zero();
  }

  return pool;
}

export function getDepositPoolAddress(transaction: ethereum.Transaction): Address {
  if (transaction.to !== null) {
    return changetype<Address>(transaction.to);
  }

  return Address.zero();
}

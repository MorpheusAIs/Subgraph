import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";

export function getUser(address: Address, rewardPoolId: BigInt, depositPool: Address): User {
  let id = address.concat(depositPool).concat(Bytes.fromByteArray(Bytes.fromBigInt(rewardPoolId)));

  let entity = User.load(id);

  if (entity == null) {
    entity = new User(id);

    entity.address = address;
    entity.rewardPoolId = rewardPoolId;
    entity.depositPool = depositPool;

    entity.staked = BigInt.zero();
    entity.claimed = BigInt.zero();
  }

  return entity;
}

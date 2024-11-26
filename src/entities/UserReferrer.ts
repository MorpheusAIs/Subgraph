import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserReferrer } from "../../generated/schema";

export function getUserReferrer(user: Address, referrer: Address, poolId: BigInt): UserReferrer {
  let id = user.concat(referrer).concat(Bytes.fromByteArray(Bytes.fromBigInt(poolId)));
  let entity = UserReferrer.load(id);

  if (entity == null) {
    entity = new UserReferrer(id);
    entity.user = user;
    entity.referrer = referrer;
    entity.poolId = poolId;
  }

  return entity;
}

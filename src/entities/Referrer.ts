import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Referrer } from "../../generated/schema";

export function getReferrer(referrer: Address, poolId: BigInt): Referrer {
  let id = referrer.concat(Bytes.fromByteArray(Bytes.fromBigInt(poolId)));
  let entity = Referrer.load(id);

  if (entity == null) {
    entity = new Referrer(id);
    entity.user = referrer;
    entity.poolId = poolId;
    entity.totalClaimed = BigInt.fromI32(0);
  }

  return entity;
}

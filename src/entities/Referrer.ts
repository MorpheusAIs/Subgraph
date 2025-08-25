import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Referrer, User } from "../../generated/schema";

export function getReferrer(user: User): Referrer {
  let id = user.id;
  let entity = Referrer.load(id);

  if (entity == null) {
    entity = new Referrer(id);
    entity.user = user.id;
    entity.referrerAddress = user.address;

    entity.claimed = BigInt.fromI32(0);
  }

  return entity;
}

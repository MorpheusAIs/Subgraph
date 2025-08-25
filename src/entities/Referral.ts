import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Referrer, User, Referral } from "../../generated/schema";

export function getReferral(referral: User, referrer: Referrer): Referral {
  let id = referral.id.concat(referrer.id);
  let entity = Referral.load(id);

  if (entity == null) {
    entity = new Referral(id);
    entity.referral = referral.id;
    entity.referrer = referrer.id;

    entity.referralAddress = referral.address;
    entity.referrerAddress = referrer.referrerAddress;

    entity.amount = BigInt.fromI32(0);
  }

  return entity;
}

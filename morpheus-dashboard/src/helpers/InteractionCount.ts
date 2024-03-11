import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { InteractionCount } from "../../generated/schema";

export function getInteractionCount(hash: Bytes): InteractionCount {
  let counter = InteractionCount.load(hash);

  if (counter == null) {
    counter = new InteractionCount(hash);
    counter.count = BigInt.zero();
  }

  return counter;
}

export function increaseCounter(counter: InteractionCount): void {
  counter.count = counter.count.plus(BigInt.fromI32(1));
  counter.save();
}

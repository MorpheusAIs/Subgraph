import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { PoolInteraction, User } from "../../generated/schema";
import { getInteractionCount, increaseCounter } from "../helpers/InteractionCount";

export enum PoolInteractionType {
  STAKE = 0,
  WITHDRAW = 1,
  CLAIM = 2,
}

export function getPoolInteraction(
  hash: Bytes,
  block: ethereum.Block,
  user: User,
  type: PoolInteractionType,
  amount: BigInt,
): PoolInteraction {
  let counter = getInteractionCount(hash);

  let id = hash.concatI32(counter.count.toI32());

  let interaction = PoolInteraction.load(id);

  if (interaction == null) {
    interaction = new PoolInteraction(id);

    interaction.transactionHash = hash;
    interaction.blockTimestamp = block.timestamp;
    interaction.blockNumber = block.number;

    interaction.user = user.id;
    interaction.type = BigInt.fromI32(type as i32);
    interaction.amount = amount;

    increaseCounter(counter);
  }

  return interaction;
}

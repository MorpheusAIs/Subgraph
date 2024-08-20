import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { PoolInteraction, UserInPool } from "../../generated/schema";
import { getInteractionCount, increaseCounter } from "../helpers/InteractionCount";

export function getPoolInteraction(
  hash: Bytes,
  userInPool: UserInPool,
  timestamp: BigInt,
  isStake: boolean,
  amount: BigInt,
  totalStaked: BigInt,
  rate: BigInt,
): PoolInteraction {
  let counter = getInteractionCount(hash);

  let id = hash.concatI32(counter.count.toI32());

  let interaction = PoolInteraction.load(id);

  if (interaction == null) {
    interaction = new PoolInteraction(id);

    interaction.hash = hash;
    interaction.timestamp = timestamp;

    interaction.isStake = isStake;
    interaction.amount = amount;

    interaction.userInPool = userInPool.id;
    interaction.pool = userInPool.pool;

    interaction.totalStaked = totalStaked;

    interaction.rate = rate;

    increaseCounter(counter);
  }

  return interaction;
}

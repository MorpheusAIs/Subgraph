import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserInteraction } from "../../generated/schema";
import { getInteractionCount, increaseCounter } from "../helpers/InteractionCount";

export function getUserInteraction(
  hash: Bytes,
  timestamp: BigInt,
  poolId: BigInt,
  user: Address,
  rate: BigInt,
  deposited: BigInt,
  claimedRewards: BigInt,
  pendingRewards: BigInt,
): UserInteraction {
  let counter = getInteractionCount(hash);

  let id = hash.concatI32(counter.count.toI32());
  let interaction = UserInteraction.load(id);

  if (interaction == null) {
    interaction = new UserInteraction(id);
    interaction.timestamp = timestamp;

    interaction.poolId = poolId;

    interaction.user = user;
    interaction.rate = rate;
    interaction.deposited = deposited;
    interaction.claimedRewards = claimedRewards;
    interaction.pendingRewards = pendingRewards;

    increaseCounter(counter);
  }

  return interaction;
}

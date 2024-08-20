import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserInteraction } from "../../generated/schema";

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
  let id = hash;
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
  }

  return interaction;
}

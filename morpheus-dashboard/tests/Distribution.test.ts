import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { afterEach, assert, clearStore, describe, test } from "matchstick-as/assembly/index";
import { getPool } from "../src/entities/Pool";
import { getUser } from "../src/entities/User";
import { getUserInPool } from "../src/entities/UserInPool";
import {
  handlePoolCreated,
  handlePoolEdited,
  handleUserClaimed,
  handleUserStaked,
  handleUserWithdrawn,
} from "../src/mappings/Distribution";
import {
  createPoolCreatedEvent,
  createPoolEditedEvent,
  createUserClaimedEvent,
  createUserStakedEvent,
  createUserWithdrawnEvent,
} from "./utils/distribution-utils";

describe("Distribution", () => {
  afterEach(() => {
    clearStore();
  });

  test("Should handle pool creation", () => {
    let poolId = BigInt.fromI32(0);

    let payoutStart = BigInt.fromI32(123);
    let decreaseInterval = BigInt.fromI32(456);
    let withdrawLockPeriod = BigInt.fromI32(789);
    let claimLockPeriod = BigInt.fromI32(101112);
    let withdrawLockPeriodAfterStake = BigInt.fromI32(131415);
    let initialReward = BigInt.fromI32(161718);
    let rewardDecrease = BigInt.fromI32(2);
    let minimalStake = BigInt.fromI32(12);
    let isPublic = true;

    let pool = new ethereum.Tuple(9);
    pool[0] = ethereum.Value.fromUnsignedBigInt(payoutStart);
    pool[1] = ethereum.Value.fromUnsignedBigInt(decreaseInterval);
    pool[2] = ethereum.Value.fromUnsignedBigInt(withdrawLockPeriod);
    pool[3] = ethereum.Value.fromUnsignedBigInt(claimLockPeriod);
    pool[4] = ethereum.Value.fromUnsignedBigInt(withdrawLockPeriodAfterStake);
    pool[5] = ethereum.Value.fromUnsignedBigInt(initialReward);
    pool[6] = ethereum.Value.fromUnsignedBigInt(rewardDecrease);
    pool[7] = ethereum.Value.fromUnsignedBigInt(minimalStake);
    pool[8] = ethereum.Value.fromBoolean(isPublic);

    let event = createPoolCreatedEvent(poolId, pool);

    handlePoolCreated(event);

    assert.entityCount("Pool", 1);

    // log.debug("Pool created: ", Bytes.fromByteArray(Bytes.fromBigInt(poolId)).toHexString());

    assert.fieldEquals("Pool", "0x00000000", "payoutStart", payoutStart.toString());
    assert.fieldEquals("Pool", "0x00000000", "decreaseInterval", decreaseInterval.toString());
    assert.fieldEquals("Pool", "0x00000000", "withdrawLockPeriod", withdrawLockPeriod.toString());
    assert.fieldEquals("Pool", "0x00000000", "claimLockPeriod", claimLockPeriod.toString());
    assert.fieldEquals("Pool", "0x00000000", "withdrawLockPeriodAfterStake", withdrawLockPeriodAfterStake.toString());
    assert.fieldEquals("Pool", "0x00000000", "initialReward", initialReward.toString());
    assert.fieldEquals("Pool", "0x00000000", "rewardDecrease", rewardDecrease.toString());
    assert.fieldEquals("Pool", "0x00000000", "minimalStake", minimalStake.toString());
    assert.fieldEquals("Pool", "0x00000000", "isPublic", isPublic.toString());
    assert.fieldEquals("Pool", "0x00000000", "totalUsers", BigInt.fromI32(0).toString());
    assert.fieldEquals("Pool", "0x00000000", "totalStaked", BigInt.fromI32(0).toString());
  });

  test("Should handle pool edition", () => {
    let poolId = BigInt.fromI32(0);

    let payoutStart = BigInt.fromI32(123);
    let decreaseInterval = BigInt.fromI32(456);
    let withdrawLockPeriod = BigInt.fromI32(789);
    let claimLockPeriod = BigInt.fromI32(101112);
    let withdrawLockPeriodAfterStake = BigInt.fromI32(131415);
    let initialReward = BigInt.fromI32(161718);
    let rewardDecrease = BigInt.fromI32(2);
    let minimalStake = BigInt.fromI32(12);
    let isPublic = true;

    let pool = new ethereum.Tuple(9);
    pool[0] = ethereum.Value.fromUnsignedBigInt(payoutStart);
    pool[1] = ethereum.Value.fromUnsignedBigInt(decreaseInterval);
    pool[2] = ethereum.Value.fromUnsignedBigInt(withdrawLockPeriod);
    pool[3] = ethereum.Value.fromUnsignedBigInt(claimLockPeriod);
    pool[4] = ethereum.Value.fromUnsignedBigInt(withdrawLockPeriodAfterStake);
    pool[5] = ethereum.Value.fromUnsignedBigInt(initialReward);
    pool[6] = ethereum.Value.fromUnsignedBigInt(rewardDecrease);
    pool[7] = ethereum.Value.fromUnsignedBigInt(minimalStake);
    pool[8] = ethereum.Value.fromBoolean(isPublic);

    let event = createPoolCreatedEvent(poolId, pool);

    handlePoolCreated(event);

    assert.entityCount("Pool", 1);

    let newPayoutStart = BigInt.fromI32(1234);
    let newDecreaseInterval = BigInt.fromI32(4567);
    let newWithdrawLockPeriod = BigInt.fromI32(7890);
    let newClaimLockPeriod = BigInt.fromI32(10111213);
    let newWithdrawLockPeriodAfterStake = BigInt.fromI32(13141516);
    let newInitialReward = BigInt.fromI32(16171819);
    let newRewardDecrease = BigInt.fromI32(3);
    let newMinimalStake = BigInt.fromI32(123);
    let newIsPublic = false;

    let newPool = new ethereum.Tuple(9);
    newPool[0] = ethereum.Value.fromUnsignedBigInt(newPayoutStart);
    newPool[1] = ethereum.Value.fromUnsignedBigInt(newDecreaseInterval);
    newPool[2] = ethereum.Value.fromUnsignedBigInt(newWithdrawLockPeriod);
    newPool[3] = ethereum.Value.fromUnsignedBigInt(newClaimLockPeriod);
    newPool[4] = ethereum.Value.fromUnsignedBigInt(newWithdrawLockPeriodAfterStake);
    newPool[5] = ethereum.Value.fromUnsignedBigInt(newInitialReward);
    newPool[6] = ethereum.Value.fromUnsignedBigInt(newRewardDecrease);
    newPool[7] = ethereum.Value.fromUnsignedBigInt(newMinimalStake);
    newPool[8] = ethereum.Value.fromBoolean(newIsPublic);

    let newEvent = createPoolEditedEvent(poolId, newPool);

    handlePoolEdited(newEvent);

    assert.entityCount("Pool", 1);

    assert.fieldEquals("Pool", "0x00000000", "payoutStart", newPayoutStart.toString());
    assert.fieldEquals("Pool", "0x00000000", "decreaseInterval", newDecreaseInterval.toString());
    assert.fieldEquals("Pool", "0x00000000", "withdrawLockPeriod", newWithdrawLockPeriod.toString());
    assert.fieldEquals("Pool", "0x00000000", "claimLockPeriod", newClaimLockPeriod.toString());
    assert.fieldEquals(
      "Pool",
      "0x00000000",
      "withdrawLockPeriodAfterStake",
      newWithdrawLockPeriodAfterStake.toString(),
    );
    assert.fieldEquals("Pool", "0x00000000", "initialReward", newInitialReward.toString());
    assert.fieldEquals("Pool", "0x00000000", "rewardDecrease", newRewardDecrease.toString());
    assert.fieldEquals("Pool", "0x00000000", "minimalStake", newMinimalStake.toString());
    assert.fieldEquals("Pool", "0x00000000", "isPublic", newIsPublic.toString());
  });

  test("Should handle user staked", () => {
    let poolId = BigInt.fromI32(0);
    let pool = getPool(poolId);
    pool.save();

    let userAddress = Address.fromString("0x86e08f7d84603AEb97cd1c89A80A9e914f181671");

    let amount = BigInt.fromI32(123);

    let event = createUserStakedEvent(poolId, userAddress, amount);

    handleUserStaked(event);

    assert.entityCount("Pool", 1);
    assert.entityCount("User", 1);
    assert.entityCount("UserInPool", 1);

    let user = getUser(userAddress);
    let userInPool = getUserInPool(pool, user);

    assert.fieldEquals("Pool", pool.id.toHexString(), "totalUsers", BigInt.fromI32(1).toString());
    assert.fieldEquals("Pool", pool.id.toHexString(), "totalStaked", amount.toString());

    assert.fieldEquals("User", userAddress.toHexString(), "totalClaimed", BigInt.fromI32(0).toString());

    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "staked", amount.toString());
    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "claimed", BigInt.fromI32(0).toString());

    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(0).toHexString(),
      "hash",
      event.transaction.hash.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(0).toHexString(),
      "timestamp",
      event.block.timestamp.toString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(0).toHexString(),
      "pool",
      pool.id.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(0).toHexString(),
      "userInPool",
      userInPool.id.toHexString(),
    );
    assert.fieldEquals("PoolInteraction", event.transaction.hash.concatI32(0).toHexString(), "isStake", "true");
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(0).toHexString(),
      "amount",
      amount.toString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(0).toHexString(),
      "totalStaked",
      amount.toString(),
    );

    handleUserStaked(event);

    assert.fieldEquals("Pool", pool.id.toHexString(), "totalUsers", BigInt.fromI32(1).toString());
    assert.fieldEquals("Pool", pool.id.toHexString(), "totalStaked", amount.times(BigInt.fromI32(2)).toString());

    assert.fieldEquals("User", userAddress.toHexString(), "totalClaimed", BigInt.fromI32(0).toString());

    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "staked", amount.times(BigInt.fromI32(2)).toString());
    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "claimed", BigInt.fromI32(0).toString());

    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(1).toHexString(),
      "hash",
      event.transaction.hash.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(1).toHexString(),
      "timestamp",
      event.block.timestamp.toString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(1).toHexString(),
      "pool",
      pool.id.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(1).toHexString(),
      "userInPool",
      userInPool.id.toHexString(),
    );
    assert.fieldEquals("PoolInteraction", event.transaction.hash.concatI32(0).toHexString(), "isStake", "true");
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(1).toHexString(),
      "amount",
      amount.toString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      event.transaction.hash.concatI32(1).toHexString(),
      "totalStaked",
      amount.times(BigInt.fromI32(2)).toString(),
    );
  });

  test("Should handle user withdrawn", () => {
    let poolId = BigInt.fromI32(0);
    let pool = getPool(poolId);
    pool.save();

    let userAddress = Address.fromString("0x86e08f7d84603AEb97cd1c89A80A9e914f181671");

    let amount = BigInt.fromI32(123);

    let event = createUserStakedEvent(poolId, userAddress, amount);

    handleUserStaked(event);

    let withdrawAmount = BigInt.fromI32(23);

    let withdrawEvent = createUserWithdrawnEvent(poolId, userAddress, withdrawAmount);

    handleUserWithdrawn(withdrawEvent);

    let user = getUser(userAddress);
    let userInPool = getUserInPool(pool, user);

    assert.fieldEquals("Pool", pool.id.toHexString(), "totalStaked", amount.minus(withdrawAmount).toString());

    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "staked", amount.minus(withdrawAmount).toString());
    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "claimed", BigInt.fromI32(0).toString());

    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(1).toHexString(),
      "hash",
      withdrawEvent.transaction.hash.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(1).toHexString(),
      "timestamp",
      withdrawEvent.block.timestamp.toString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(1).toHexString(),
      "pool",
      pool.id.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(1).toHexString(),
      "userInPool",
      userInPool.id.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(1).toHexString(),
      "isStake",
      "false",
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(1).toHexString(),
      "amount",
      withdrawAmount.toString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(1).toHexString(),
      "totalStaked",
      amount.minus(withdrawAmount).toString(),
    );

    handleUserWithdrawn(withdrawEvent);

    assert.fieldEquals(
      "UserInPool",
      userInPool.id.toHexString(),
      "staked",
      amount.minus(withdrawAmount.times(BigInt.fromI32(2))).toString(),
    );
    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "claimed", BigInt.fromI32(0).toString());

    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(2).toHexString(),
      "hash",
      withdrawEvent.transaction.hash.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(2).toHexString(),
      "timestamp",
      withdrawEvent.block.timestamp.toString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(2).toHexString(),
      "pool",
      pool.id.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(2).toHexString(),
      "userInPool",
      userInPool.id.toHexString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(2).toHexString(),
      "isStake",
      "false",
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(2).toHexString(),
      "amount",
      withdrawAmount.toString(),
    );
    assert.fieldEquals(
      "PoolInteraction",
      withdrawEvent.transaction.hash.concatI32(2).toHexString(),
      "totalStaked",
      amount.minus(withdrawAmount.times(BigInt.fromI32(2))).toString(),
    );
  });

  test("Should handle user claimed", () => {
    let poolId = BigInt.fromI32(0);
    let pool = getPool(poolId);
    pool.save();

    let userAddress = Address.fromString("0x86e08f7d84603AEb97cd1c89A80A9e914f181671");

    let amount = BigInt.fromI32(123);

    let event = createUserClaimedEvent(poolId, userAddress, userAddress, amount);

    handleUserClaimed(event);

    let user = getUser(userAddress);
    let userInPool = getUserInPool(pool, user);

    assert.fieldEquals("Pool", pool.id.toHexString(), "totalUsers", BigInt.fromI32(1).toString());

    assert.fieldEquals("User", userAddress.toHexString(), "totalClaimed", amount.toString());
    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "claimed", amount.toString());

    handleUserClaimed(event);

    assert.fieldEquals("Pool", pool.id.toHexString(), "totalUsers", BigInt.fromI32(1).toString());

    assert.fieldEquals("User", userAddress.toHexString(), "totalClaimed", amount.times(BigInt.fromI32(2)).toString());
    assert.fieldEquals(
      "UserInPool",
      userInPool.id.toHexString(),
      "claimed",
      amount.times(BigInt.fromI32(2)).toString(),
    );

    poolId = BigInt.fromI32(1);
    pool = getPool(poolId);
    pool.save();

    event = createUserClaimedEvent(poolId, userAddress, userAddress, amount);

    handleUserClaimed(event);

    userInPool = getUserInPool(pool, user);

    assert.fieldEquals("Pool", pool.id.toHexString(), "totalUsers", BigInt.fromI32(1).toString());

    assert.fieldEquals("User", userAddress.toHexString(), "totalClaimed", amount.times(BigInt.fromI32(3)).toString());
    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "claimed", amount.toString());
  });

  test("Should handle user claimed for another address", () => {
    let poolId = BigInt.fromI32(0);
    let pool = getPool(poolId);
    pool.save();

    let userAddress = Address.fromString("0x86e08f7d84603AEb97cd1c89A80A9e914f181671");
    let receiverAddress = Address.fromString("0x86e08f7d84603AEb97cd1c89A80A9e914f181672");

    let amount = BigInt.fromI32(123);

    let event = createUserClaimedEvent(poolId, userAddress, receiverAddress, amount);

    handleUserClaimed(event);

    let user = getUser(userAddress);
    let userInPool = getUserInPool(pool, user);

    assert.fieldEquals("Pool", pool.id.toHexString(), "totalUsers", BigInt.fromI32(1).toString());

    assert.fieldEquals("User", userAddress.toHexString(), "totalClaimed", amount.toString());
    assert.fieldEquals("UserInPool", userInPool.id.toHexString(), "claimed", amount.toString());

    let receiver = getUser(receiverAddress);
    receiver.save();
    let receiverInPool = getUserInPool(pool, receiver);
    receiverInPool.save();

    assert.fieldEquals("User", receiverAddress.toHexString(), "totalClaimed", BigInt.fromI32(0).toString());
    assert.fieldEquals("UserInPool", receiverInPool.id.toHexString(), "claimed", BigInt.fromI32(0).toString());
  });
});

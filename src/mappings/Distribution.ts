import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  Initialized as InitializedEvent,
  OverplusBridged as OverplusBridgedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PoolCreated as PoolCreatedEvent,
  PoolEdited as PoolEditedEvent,
  Upgraded as UpgradedEvent,
  UserClaimed as UserClaimedEvent,
  UserStaked as UserStakedEvent,
  UserWithdrawn as UserWithdrawnEvent,
} from "../../generated/Distribution/Distribution";
import {
  AdminChanged,
  BeaconUpgraded,
  Initialized,
  OverplusBridged,
  OwnershipTransferred,
  Upgraded,
} from "../../generated/schema";
import { getPool } from "../entities/Pool";
import { getPoolInteraction } from "../entities/PoolInteraction";
import { getUser } from "../entities/User";
import { getUserInPool } from "../entities/UserInPool";

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.previousAdmin = event.params.previousAdmin;
  entity.newAdmin = event.params.newAdmin;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBeaconUpgraded(event: BeaconUpgradedEvent): void {
  let entity = new BeaconUpgraded(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.beacon = event.params.beacon;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.version = event.params.version;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOverplusBridged(event: OverplusBridgedEvent): void {
  let entity = new OverplusBridged(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.amount = event.params.amount;
  entity.uniqueId = event.params.uniqueId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let pool = getPool(
    event.params.poolId,
    event.params.pool.payoutStart,
    event.params.pool.decreaseInterval,
    event.params.pool.withdrawLockPeriod,
    event.params.pool.claimLockPeriod,
    event.params.pool.withdrawLockPeriodAfterStake,
    event.params.pool.initialReward,
    event.params.pool.rewardDecrease,
    event.params.pool.minimalStake,
    event.params.pool.isPublic,
  );

  pool.save();
}

export function handlePoolEdited(event: PoolEditedEvent): void {
  let pool = getPool(event.params.poolId);

  pool.payoutStart = event.params.pool.payoutStart;
  pool.decreaseInterval = event.params.pool.decreaseInterval;
  pool.withdrawLockPeriod = event.params.pool.withdrawLockPeriod;
  pool.claimLockPeriod = event.params.pool.claimLockPeriod;
  pool.withdrawLockPeriodAfterStake = event.params.pool.withdrawLockPeriodAfterStake;
  pool.initialReward = event.params.pool.initialReward;
  pool.rewardDecrease = event.params.pool.rewardDecrease;
  pool.minimalStake = event.params.pool.minimalStake;
  pool.isPublic = event.params.pool.isPublic;

  pool.save();
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.implementation = event.params.implementation;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUserClaimed(event: UserClaimedEvent): void {
  let pool = getPool(event.params.poolId);
  let user = getUser(event.params.user);
  let userInPool = getUserInPool(pool, user);

  user.totalClaimed = user.totalClaimed.plus(event.params.amount);
  userInPool.claimed = userInPool.claimed.plus(event.params.amount);

  pool.save();
  user.save();
  userInPool.save();
}

export function handleUserStaked(event: UserStakedEvent): void {
  let pool = getPool(event.params.poolId);
  let user = getUser(event.params.user);
  let userInPool = getUserInPool(pool, user);

  userInPool.staked = userInPool.staked.plus(event.params.amount);
  pool.totalStaked = pool.totalStaked.plus(event.params.amount);

  getPoolInteraction(
    event.transaction.hash,
    userInPool,
    event.block.timestamp,
    true,
    event.params.amount,
    pool.totalStaked,
  ).save();

  pool.save();
  user.save();
  userInPool.save();
}

export function handleUserWithdrawn(event: UserWithdrawnEvent): void {
  let pool = getPool(event.params.poolId);
  let user = getUser(event.params.user);
  let userInPool = getUserInPool(pool, user);

  userInPool.staked = userInPool.staked.minus(event.params.amount);
  pool.totalStaked = pool.totalStaked.minus(event.params.amount);

  getPoolInteraction(
    event.transaction.hash,
    userInPool,
    event.block.timestamp,
    false,
    event.params.amount,
    pool.totalStaked,
  ).save();

  pool.save();
  userInPool.save();
}

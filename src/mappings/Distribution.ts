import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  Distribution,
  Distribution__usersDataResult,
  Initialized as InitializedEvent,
  OverplusBridged as OverplusBridgedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PoolCreated as PoolCreatedEvent,
  PoolEdited as PoolEditedEvent,
  Upgraded as UpgradedEvent,
  UserClaimed as UserClaimedEvent,
  UserClaimLocked,
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
  User,
} from "../../generated/schema";
import { getPool } from "../entities/Pool";
import { getPoolInteraction } from "../entities/PoolInteraction";
import { getUser } from "../entities/User";
import { getUserInPool } from "../entities/UserInPool";
import { getUserInteraction } from "../entities/UserInteraction";

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

  const userData = _getUserData(event.address, event.params.poolId, event.params.user);

  getUserInteraction(
    event.transaction.hash,
    event.block.timestamp,
    event.params.poolId,
    event.params.user,
    userData.getRate(),
    _getUserDataDepozited(userData),
    user.totalClaimed,
    userData.getPendingRewards(),
  ).save();

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

  const userData = _getUserData(event.address, event.params.poolId, event.params.user);

  getPoolInteraction(
    event.transaction.hash,
    userInPool,
    event.block.timestamp,
    true,
    event.params.amount,
    pool.totalStaked,
    userData.getRate(),
  ).save();

  getUserInteraction(
    event.transaction.hash,
    event.block.timestamp,
    event.params.poolId,
    event.params.user,
    userData.getRate(),
    _getUserDataDepozited(userData),
    user.totalClaimed,
    userData.getPendingRewards(),
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

  const userData = _getUserData(event.address, event.params.poolId, event.params.user);

  getPoolInteraction(
    event.transaction.hash,
    userInPool,
    event.block.timestamp,
    false,
    event.params.amount,
    pool.totalStaked,
    userData.getRate(),
  ).save();

  getUserInteraction(
    event.transaction.hash,
    event.block.timestamp,
    event.params.poolId,
    event.params.user,
    userData.getRate(),
    _getUserDataDepozited(userData),
    user.totalClaimed,
    userData.getPendingRewards(),
  ).save();

  pool.save();
  userInPool.save();
}

export function handleUserClaimLocked(event: UserClaimLocked): void {
  let pool = getPool(event.params.poolId);
  let user = getUser(event.params.user);
  let userInPool = getUserInPool(pool, user);

  const userData = _getUserData(event.address, event.params.poolId, event.params.user);

  getPoolInteraction(
    event.transaction.hash,
    userInPool,
    event.block.timestamp,
    true,
    BigInt.zero(),
    pool.totalStaked,
    userData.getRate(),
  ).save();

  getUserInteraction(
    event.transaction.hash,
    event.block.timestamp,
    event.params.poolId,
    event.params.user,
    userData.getRate(),
    _getUserDataDepozited(userData),
    user.totalClaimed,
    userData.getPendingRewards(),
  ).save();

  pool.save();
  userInPool.save();
}

function _getUserData(address: Address, poolId: BigInt, user: Address): Distribution__usersDataResult {
  const distribution = Distribution.bind(address);
  let res = distribution.try_usersData(user, poolId);
  if (res.reverted) {
    // Fallback for old contracts
    const result = distribution.call("usersData", "usersData(address,uint256):(uint128,uint256,uint256,uint256)", [
      ethereum.Value.fromAddress(user),
      ethereum.Value.fromUnsignedBigInt(poolId),
    ]);

    res = ethereum.CallResult.fromValue(
      new Distribution__usersDataResult(
        result[0].toBigInt(),
        result[1].toBigInt(),
        result[2].toBigInt(),
        result[3].toBigInt(),
        BigInt.zero(),
        BigInt.zero(),
        BigInt.zero(),
      ),
    );
  }

  return res.value;
}

function _getUserDataDepozited(userData: Distribution__usersDataResult): BigInt {
  return userData.getVirtualDeposited().isZero() ? userData.getDeposited() : userData.getVirtualDeposited();
}

import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  DepositPool,
  DepositPool__usersDataResult,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ReferrerClaimed,
  Upgraded as UpgradedEvent,
  UserClaimed as UserClaimedEvent,
  UserReferred as UserReferredEvent,
  UserStaked as UserStakedEvent,
  UserWithdrawn as UserWithdrawnEvent,
} from "../../generated/DepositPoolLink/DepositPool";
import { AdminChanged, BeaconUpgraded, Initialized, OwnershipTransferred, Upgraded } from "../../generated/schema";
import { getPoolInteraction, PoolInteractionType } from "../entities/PoolInteraction";
import { getReferrer } from "../entities/Referrer";
import { getReferral } from "../entities/Referral";
import { getUser } from "../entities/User";
import { getDepositPool, getDepositPoolAddress } from "../entities/DepositPool";

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.previousAdmin = event.params.previousAdmin;
  entity.newAdmin = event.params.newAdmin;
  entity.depositPool = getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBeaconUpgraded(event: BeaconUpgradedEvent): void {
  let entity = new BeaconUpgraded(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.beacon = event.params.beacon;
  entity.depositPool = getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.version = event.params.version;
  entity.depositPool = getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;
  entity.depositPool = getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.implementation = event.params.implementation;
  entity.depositPool = getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUserClaimed(event: UserClaimedEvent): void {
  let depositPool = getDepositPool(event.params.rewardPoolIndex, getDepositPoolAddress(event.transaction));
  depositPool.save();

  let user = getUser(event.params.user, event.params.rewardPoolIndex, depositPool.depositPool);
  user.claimed = user.claimed.plus(event.params.amount);
  user.save();

  const userData = _getUserData(event.address, event.params.rewardPoolIndex, event.params.user);

  let poolInteraction = getPoolInteraction(
    event.transaction.hash,
    event.block,
    user,
    PoolInteractionType.CLAIM,
    event.params.amount,
    depositPool.totalStaked,
    userData.getRate(),
  );

  poolInteraction.save();
}

export function handleUserStaked(event: UserStakedEvent): void {
  let depositPool = getDepositPool(event.params.rewardPoolIndex, getDepositPoolAddress(event.transaction));

  let user = getUser(event.params.user, event.params.rewardPoolIndex, depositPool.depositPool);
  user.staked = user.staked.plus(event.params.amount);
  user.save();

  depositPool.totalStaked = depositPool.totalStaked.plus(event.params.amount);
  depositPool.save();

  const userData = _getUserData(event.address, event.params.rewardPoolIndex, event.params.user);

  let poolInteraction = getPoolInteraction(
    event.transaction.hash,
    event.block,
    user,
    PoolInteractionType.STAKE,
    event.params.amount,
    depositPool.totalStaked,
    userData.getRate(),
  );

  poolInteraction.save();
}

export function handleUserWithdrawn(event: UserWithdrawnEvent): void {
  let depositPool = getDepositPool(event.params.rewardPoolIndex, getDepositPoolAddress(event.transaction));

  let user = getUser(event.params.user, event.params.rewardPoolIndex, depositPool.depositPool);
  user.staked = user.staked.minus(event.params.amount);
  user.save();

  depositPool.totalStaked = depositPool.totalStaked.minus(event.params.amount);
  depositPool.save();

  const userData = _getUserData(event.address, event.params.rewardPoolIndex, event.params.user);

  let poolInteraction = getPoolInteraction(
    event.transaction.hash,
    event.block,
    user,
    PoolInteractionType.WITHDRAW,
    event.params.amount,
    depositPool.totalStaked,
    userData.getRate(),
  );

  poolInteraction.save();
}

export function handleUserReferred(event: UserReferredEvent): void {
  let depositPool = getDepositPool(event.params.rewardPoolIndex, getDepositPoolAddress(event.transaction));
  depositPool.save();

  let referrerUser = getUser(event.params.user, event.params.rewardPoolIndex, depositPool.depositPool);
  referrerUser.save();

  let referrer = getReferrer(referrerUser);
  referrer.save();

  let referralUser = getUser(event.params.referrer, event.params.rewardPoolIndex, depositPool.depositPool);
  referralUser.save();

  let referral = getReferral(referralUser, referrer);
  referral.amount = event.params.amount;
  referral.save();
}

export function handleReferrerClaimed(event: ReferrerClaimed): void {
  let depositPool = getDepositPool(event.params.rewardPoolIndex, getDepositPoolAddress(event.transaction));
  depositPool.save();

  let referrerUser = getUser(event.params.user, event.params.rewardPoolIndex, depositPool.depositPool);
  referrerUser.save();

  let referrer = getReferrer(referrerUser);
  referrer.claimed = referrer.claimed.plus(event.params.amount);
  referrer.save();
}

function _getUserData(address: Address, poolId: BigInt, user: Address): DepositPool__usersDataResult {
  const depositPool = DepositPool.bind(address);
  const versionData = depositPool.try_version();
  const version = versionData.reverted ? new BigInt(1) : versionData.value;

  const signatures = [
    "usersData(address,uint256):(uint128,uint256,uint256,uint256)", // v0. When version call return none (e.g. 0)
    "usersData(address,uint256):(uint128,uint256,uint256,uint256)", // v1. The same as v0
    "usersData(address,uint256):(uint128,uint256,uint256,uint256,uint128,uint128,uint256)", // v2
    "usersData(address,uint256):(uint128,uint256,uint256,uint256,uint128,uint128,uint256)", // v3
    "usersData(address,uint256):(uint128,uint256,uint256,uint256,uint128,uint128,uint256,uint128)", // v4
    "usersData(address,uint256):(uint128,uint256,uint256,uint256,uint128,uint128,uint256,uint128,address)", // v5
    "usersData(address,uint256):(uint128,uint256,uint256,uint256,uint128,uint128,uint256,uint128,address)", // v6 - not deployed
    "usersData(address,uint256):(uint128,uint256,uint256,uint256,uint128,uint128,uint256,uint128,address)", // v7
  ];

  if (signatures.length + 1 > version.toI32()) {
    const result = _callUsersData(depositPool, user, poolId, signatures[version.toI32()]);

    if (result !== null) {
      return result;
    }
  }

  return new DepositPool__usersDataResult(
    BigInt.zero(),
    BigInt.zero(),
    BigInt.zero(),
    BigInt.zero(),
    BigInt.zero(),
    BigInt.zero(),
    BigInt.zero(),
    BigInt.zero(),
    Address.zero(),
  );
}

function _callUsersData(
  depositPool: DepositPool,
  user: Address,
  poolId: BigInt,
  signature: string,
): DepositPool__usersDataResult | null {
  const result = depositPool.tryCall("usersData", signature, [
    ethereum.Value.fromAddress(user),
    ethereum.Value.fromUnsignedBigInt(poolId),
  ]);

  if (!result.reverted) {
    return new DepositPool__usersDataResult(
      result.value[0].toBigInt(),
      result.value[1].toBigInt(),
      result.value[2].toBigInt(),
      result.value[3].toBigInt(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      Address.zero(),
    );
  }

  return null;
}

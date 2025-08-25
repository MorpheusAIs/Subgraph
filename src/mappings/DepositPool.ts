import { Address, ethereum } from "@graphprotocol/graph-ts";
import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
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

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.previousAdmin = event.params.previousAdmin;
  entity.newAdmin = event.params.newAdmin;
  entity.depositPool = _getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBeaconUpgraded(event: BeaconUpgradedEvent): void {
  let entity = new BeaconUpgraded(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.beacon = event.params.beacon;
  entity.depositPool = _getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.version = event.params.version;
  entity.depositPool = _getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;
  entity.depositPool = _getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.implementation = event.params.implementation;
  entity.depositPool = _getDepositPoolAddress(event.transaction);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUserClaimed(event: UserClaimedEvent): void {
  let depositPool = _getDepositPoolAddress(event.transaction);

  let user = getUser(event.params.user, event.params.rewardPoolIndex, depositPool);
  user.claimed = user.claimed.plus(event.params.amount);
  user.save();

  let poolInteraction = getPoolInteraction(
    event.transaction.hash,
    event.block,
    user,
    PoolInteractionType.CLAIM,
    event.params.amount,
  );

  poolInteraction.save();
}

export function handleUserStaked(event: UserStakedEvent): void {
  let depositPool = _getDepositPoolAddress(event.transaction);

  let user = getUser(event.params.user, event.params.rewardPoolIndex, depositPool);
  user.staked = user.staked.plus(event.params.amount);
  user.save();

  let poolInteraction = getPoolInteraction(
    event.transaction.hash,
    event.block,
    user,
    PoolInteractionType.STAKE,
    event.params.amount,
  );

  poolInteraction.save();
}

export function handleUserWithdrawn(event: UserWithdrawnEvent): void {
  let depositPool = _getDepositPoolAddress(event.transaction);

  let user = getUser(event.params.user, event.params.rewardPoolIndex, depositPool);
  user.staked = user.staked.minus(event.params.amount);
  user.save();

  let poolInteraction = getPoolInteraction(
    event.transaction.hash,
    event.block,
    user,
    PoolInteractionType.WITHDRAW,
    event.params.amount,
  );

  poolInteraction.save();
}

export function handleUserReferred(event: UserReferredEvent): void {
  let depositPool = _getDepositPoolAddress(event.transaction);

  let referrerUser = getUser(event.params.user, event.params.rewardPoolIndex, depositPool);
  referrerUser.save();

  let referrer = getReferrer(referrerUser);
  referrer.save();

  let referralUser = getUser(event.params.referrer, event.params.rewardPoolIndex, depositPool);
  referralUser.save();

  let referral = getReferral(referralUser, referrer);
  referral.amount = event.params.amount;
  referral.save();
}

export function handleReferrerClaimed(event: ReferrerClaimed): void {
  let depositPool = _getDepositPoolAddress(event.transaction);

  let referrerUser = getUser(event.params.user, event.params.rewardPoolIndex, depositPool);
  referrerUser.save();

  let referrer = getReferrer(referrerUser);
  referrer.claimed = referrer.claimed.plus(event.params.amount);
  referrer.save();
}

function _getDepositPoolAddress(transaction: ethereum.Transaction): Address {
  if (transaction.to !== null) {
    return changetype<Address>(transaction.to);
  }

  return Address.zero();
}

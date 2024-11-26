import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent, createMockedFunction } from "matchstick-as";
import {
  AdminChanged,
  BeaconUpgraded,
  Initialized,
  OverplusBridged,
  OwnershipTransferred,
  PoolCreated,
  PoolEdited,
  ReferrerClaimed,
  Upgraded,
  UserClaimed,
  UserReferred,
  UserStaked,
  UserWithdrawn,
} from "../../generated/Distribution/Distribution";

export function createAdminChangedEvent(previousAdmin: Address, newAdmin: Address): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent());

  adminChangedEvent.parameters = new Array();

  adminChangedEvent.parameters.push(
    new ethereum.EventParam("previousAdmin", ethereum.Value.fromAddress(previousAdmin)),
  );
  adminChangedEvent.parameters.push(new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin)));

  return adminChangedEvent;
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent());

  beaconUpgradedEvent.parameters = new Array();

  beaconUpgradedEvent.parameters.push(new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon)));

  return beaconUpgradedEvent;
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent());

  initializedEvent.parameters = new Array();

  initializedEvent.parameters.push(
    new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))),
  );

  return initializedEvent;
}

export function createOverplusBridgedEvent(amount: BigInt, uniqueId: Bytes): OverplusBridged {
  let overplusBridgedEvent = changetype<OverplusBridged>(newMockEvent());

  overplusBridgedEvent.parameters = new Array();

  overplusBridgedEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));
  overplusBridgedEvent.parameters.push(new ethereum.EventParam("uniqueId", ethereum.Value.fromBytes(uniqueId)));

  return overplusBridgedEvent;
}

export function createOwnershipTransferredEvent(previousOwner: Address, newOwner: Address): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(newMockEvent());

  ownershipTransferredEvent.parameters = new Array();

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("previousOwner", ethereum.Value.fromAddress(previousOwner)),
  );
  ownershipTransferredEvent.parameters.push(new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner)));

  return ownershipTransferredEvent;
}

export function createPoolCreatedEvent(poolId: BigInt, pool: ethereum.Tuple): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent());

  poolCreatedEvent.parameters = new Array();

  poolCreatedEvent.parameters.push(new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId)));
  poolCreatedEvent.parameters.push(new ethereum.EventParam("pool", ethereum.Value.fromTuple(pool)));

  return poolCreatedEvent;
}

export function createPoolEditedEvent(poolId: BigInt, pool: ethereum.Tuple): PoolEdited {
  let poolEditedEvent = changetype<PoolEdited>(newMockEvent());

  poolEditedEvent.parameters = new Array();

  poolEditedEvent.parameters.push(new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId)));
  poolEditedEvent.parameters.push(new ethereum.EventParam("pool", ethereum.Value.fromTuple(pool)));

  return poolEditedEvent;
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent());

  upgradedEvent.parameters = new Array();

  upgradedEvent.parameters.push(new ethereum.EventParam("implementation", ethereum.Value.fromAddress(implementation)));

  return upgradedEvent;
}

export function createUserClaimedEvent(poolId: BigInt, user: Address, receiver: Address, amount: BigInt): UserClaimed {
  let userClaimedEvent = changetype<UserClaimed>(newMockEvent());

  userClaimedEvent.parameters = new Array();

  userClaimedEvent.parameters.push(new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId)));
  userClaimedEvent.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(user)));
  userClaimedEvent.parameters.push(new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)));
  userClaimedEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));

  return userClaimedEvent;
}

export function createUserStakedEvent(poolId: BigInt, user: Address, amount: BigInt): UserStaked {
  let userStakedEvent = changetype<UserStaked>(newMockEvent());

  userStakedEvent.parameters = new Array();

  userStakedEvent.parameters.push(new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId)));
  userStakedEvent.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(user)));
  userStakedEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));

  return userStakedEvent;
}

export function createUserWithdrawnEvent(poolId: BigInt, user: Address, amount: BigInt): UserWithdrawn {
  let userWithdrawnEvent = changetype<UserWithdrawn>(newMockEvent());

  userWithdrawnEvent.parameters = new Array();

  userWithdrawnEvent.parameters.push(new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId)));
  userWithdrawnEvent.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(user)));
  userWithdrawnEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));

  return userWithdrawnEvent;
}

export function createUserReferredEvent(
  poolId: BigInt,
  user: Address,
  referrer: Address,
  amount: BigInt,
): UserReferred {
  let event = changetype<UserReferred>(newMockEvent());

  event.parameters = new Array();

  event.parameters.push(new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId)));
  event.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(user)));
  event.parameters.push(new ethereum.EventParam("referrer", ethereum.Value.fromAddress(referrer)));
  event.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));

  return event;
}

export function createReferrerClaimedEvent(
  poolId: BigInt,
  user: Address,
  receiver: Address,
  amount: BigInt,
): ReferrerClaimed {
  let event = changetype<ReferrerClaimed>(newMockEvent());

  event.parameters = new Array();

  event.parameters.push(new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId)));
  event.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(user)));
  event.parameters.push(new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver)));
  event.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));

  return event;
}

export function mockUsersDataCall(contract: Address, user: Address, poolId: BigInt): void {
  createMockedFunction(contract, "version", "version():(uint256)").returns([
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString("5")),
  ]);

  createMockedFunction(
    contract,
    "usersData",
    "usersData(address,uint256):(uint128,uint256,uint256,uint256,uint128,uint128,uint256,uint128,address)",
  )
    .withArgs([ethereum.Value.fromAddress(user), ethereum.Value.fromUnsignedBigInt(poolId)])
    .returns([
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString("0")),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1")),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString("2")),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString("3")),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString("4")),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString("5")),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString("6")),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString("7")),
      ethereum.Value.fromAddress(Address.fromString("0x000000000000000000000000000000000000007b")),
    ]);
}

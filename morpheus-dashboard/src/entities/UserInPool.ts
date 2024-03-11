import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Pool, User, UserInPool } from "../../generated/schema";

export function getUserInPool(pool: Pool, user: User): UserInPool {
  let id = user.id.concat(pool.id);

  let userInPool = UserInPool.load(id);

  if (userInPool == null) {
    userInPool = new UserInPool(id);

    userInPool.pool = pool.id;
    userInPool.user = user.id;

    userInPool.staked = BigInt.zero();
    userInPool.claimed = BigInt.zero();

    pool.totalUsers = pool.totalUsers.plus(BigInt.fromI32(1));
  }

  return userInPool;
}

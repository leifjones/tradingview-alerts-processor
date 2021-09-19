import { Account } from '../entities/account.entities';
import { debug, error, info } from './logger.service';
import {
  ACCOUNT_WRITE_SUCCESS,
  ACCOUNT_WRITE_ERROR,
  ACCOUNT_READ_SUCCESS,
  ACCOUNT_READ_ERROR,
  ACCOUNT_DELETE_SUCCESS,
  ACCOUNT_WRITE_ERROR_ALREADY_EXISTS,
  ACCOUNTS_READ_SUCCESS
} from '../messages/account.messages';
import { AccountReadError, AccountWriteError } from '../errors/account.errors';
import { DatabaseService } from './db/db.service';
import { TradingService } from './trading/trading.service';
import { getAccountId } from '../utils/account.utils';
import { DatabaseId } from '../constants/db.constants';

const accounts = new Map<string, Account>();

const REDIS_WILDCARD = '*';

export const writeAccount = async (account: Account): Promise<Account> => {
  const { exchange } = account;
  const id = getAccountId(account);
  let db;
  try {
    db = DatabaseService.getDatabaseInstance();
    const res = await db.read(id);
    if (!res) {
      error(ACCOUNT_READ_ERROR(id));
      throw new AccountReadError(ACCOUNT_READ_ERROR(id));
    }
  } catch (err) {
    try {
      await (await TradingService.getTradeExecutor(exchange))
        .getExchangeService()
        .refreshSession(account);
    } catch (err) {
      error(ACCOUNT_WRITE_ERROR(id), err);
      throw new AccountWriteError(ACCOUNT_WRITE_ERROR(id, err.message));
    }

    try {
      await db.create(id, account);
      // TODO extract this and add another error type in case of reading failure
      // cache account only if success
      accounts.set(id, account);
      info(ACCOUNT_WRITE_SUCCESS(id));
      // this too
      return readAccount(id);
    } catch (err) {
      error(ACCOUNT_WRITE_ERROR(id), err);
      throw new AccountWriteError(ACCOUNT_WRITE_ERROR(id, err.message));
    }
  }
  // TODO replace by a more appropriate error type
  error(ACCOUNT_WRITE_ERROR_ALREADY_EXISTS(id));
  throw new AccountWriteError(ACCOUNT_WRITE_ERROR_ALREADY_EXISTS(id));
};

export const readAccount = async (accountId: string): Promise<Account> => {
  const id = accountId.toUpperCase();
  let account = accounts.get(id);
  if (!account) {
    try {
      const db = DatabaseService.getDatabaseInstance();
      account = (await db.read(id)) as Account;
      accounts.set(id, account);
    } catch (err) {
      error(ACCOUNT_READ_ERROR(id), err);
      throw new AccountReadError(ACCOUNT_READ_ERROR(id, err.message));
    }
  }
  // we double check here
  account = accounts.get(id);
  if (!account) {
    error(ACCOUNT_READ_ERROR(id));
    throw new AccountReadError(ACCOUNT_READ_ERROR(id));
  }
  debug(ACCOUNT_READ_SUCCESS(id));
  return account;
};

export const readAccounts = async (): Promise<Account[]> => {
  try {
    const db = DatabaseService.getDatabaseInstance();
    const id =
      DatabaseService.getType() === DatabaseId.REDIS ? REDIS_WILDCARD : '';
    const accounts = (await db.read(id)) as Record<string, Account>;
    debug(ACCOUNTS_READ_SUCCESS());
    return Object.values(accounts);
  } catch (err) {
    // TODO update logs
    error(ACCOUNT_READ_ERROR(REDIS_WILDCARD), err);
    throw new AccountReadError(ACCOUNT_READ_ERROR(REDIS_WILDCARD, err.message));
  }
};

export const removeAccount = async (accountId: string): Promise<boolean> => {
  const id = accountId.toUpperCase();
  try {
    const db = DatabaseService.getDatabaseInstance();
    accounts.delete(id);
    await db.delete(id);
  } catch (err) {
    error(ACCOUNT_READ_ERROR(id), err);
    throw new AccountWriteError(ACCOUNT_READ_ERROR(id, err.message));
  }
  info(ACCOUNT_DELETE_SUCCESS(id));
  return true;
};

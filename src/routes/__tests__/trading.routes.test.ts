import { Request, Response } from 'express';
import { postTrade } from '../trading.routes';
import { TradingService } from '../../services/trading/trading.service';
import { TradingExecutor } from '../../services/trading/trading.executor';
import { DatabaseService } from '../../services/db/db.service';

describe('Trading routes', () => {
  describe('postTrade', () => {
    it.todo('should process single trade');

    it.todo('should process multiple trades');

    it.todo('should return success');

    it.todo('should return error');
  });
});

describe('Duplicate guard', () => {
  afterEach(() => {
    jest.clearAllMocks();
    const db = DatabaseService.getDatabaseInstance();
    db.delete('testStub');
  });

  it('should prevent running duplicate orders (multiple requests)', async () => {
    const trade = {
      stub: 'testStub',
      direction: 'buy',
      symbol: 'ETH/USD',
      size: '50',
      chart: 'T3WBq7Nf',
      TCycles: '1',
      TBuys: '2'
    };

    // const trades = [];
    // trades.push(trade);
    // trades.push(trade);

    const req = {
      body: trade
    } as Request;

    const res = {} as Response;
    res.status = jest.fn(() => res); // necessary?
    res.send = jest.fn(); // necessary?
    res.end = jest.fn();
    res.write = jest.fn();
    res.writeHead = jest.fn();

    const tradeExecutor = {} as TradingExecutor;
    tradeExecutor.addTrade = jest.fn(() => Promise.resolve(true));
    jest
      .spyOn(TradingService, 'getTradeExecutor')
      .mockReturnValue(tradeExecutor);

    await postTrade(req, res);
    postTrade(req, res);

    expect(tradeExecutor.addTrade).toHaveBeenCalledTimes(1);
  });

  it.todo('should prevent running duplicate orders (multiple orders in same)');

  it.todo('should allow unique orders');

  it.todo('should still succeed with malformed unique orders identifiers'); // e.g. non-numeric TCycles

  it.todo('should delete old records');
});

import { ExchangeId } from '../../../constants/exchanges.constants';
import { BinanceFuturesUSDMExchangeService } from '..';

describe('Binance futures USDM exchange service', () => {
  describe('constructor', () => {
    it('should set exchange id and set defaultExchange', () => {
      const exchangeId = ExchangeId.BinanceFuturesUSD;
      const exchange = new BinanceFuturesUSDMExchangeService();
      expect(exchange.exchangeId).toEqual(exchangeId);
      expect(exchange.defaultExchange.constructor.name).toBe(exchangeId);
    });
  });

  describe('fetchPositions', () => {
    it.todo('should fetch positions');

    it.todo('should throw on error');
  });

  describe('getCloseOrderOptions', () => {
    it.todo('should fetch ticker position');

    it.todo('should handle relative order size');

    it.todo('should handle absolute order size');

    it.todo('should handle maximum order size');

    it.todo('should return order options');
  });
});

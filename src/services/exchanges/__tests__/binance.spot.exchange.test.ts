import { ExchangeId } from '../../../constants/exchanges.constants';
import { BinanceSpotExchangeService } from '..';

describe('Binance spot exchange service', () => {
  describe('constructor', () => {
    it('should set exchange id and set defaultExchange', () => {
      const exchangeId = ExchangeId.Binance;
      const exchange = new BinanceSpotExchangeService();
      expect(exchange.exchangeId).toEqual(exchangeId);
      expect(exchange.defaultExchange.constructor.name).toBe(exchangeId);
    });
  });
});

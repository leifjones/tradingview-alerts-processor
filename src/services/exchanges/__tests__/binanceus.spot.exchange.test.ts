import { BinanceUSSpotExchangeService } from '..';
import { ExchangeId } from '../../../constants/exchanges.constants';

describe('Binance US spot exchange service', () => {
  describe('constructor', () => {
    it('should set exchange id and set defaultExchange', () => {
      const exchangeId = ExchangeId.BinanceUS;
      const exchange = new BinanceUSSpotExchangeService();
      expect(exchange.exchangeId).toEqual(exchangeId);
      expect(exchange.defaultExchange.constructor.name).toBe(exchangeId);
    });
  });
});

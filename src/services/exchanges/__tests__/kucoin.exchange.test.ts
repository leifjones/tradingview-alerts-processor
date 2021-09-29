import { KuCoinExchangeService } from '..';
import { ExchangeId } from '../../../constants/exchanges.constants';

describe('Kucoin spot exchange service', () => {
  describe('constructor', () => {
    it('should set exchange id and set defaultExchange', () => {
      const exchangeId = ExchangeId.KuCoin;
      const exchange = new KuCoinExchangeService();
      expect(exchange.exchangeId).toEqual(exchangeId);
      expect(exchange.defaultExchange.constructor.name).toBe(exchangeId);
    });
  });
});

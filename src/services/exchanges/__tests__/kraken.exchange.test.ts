import { KrakenExchangeService } from '..';
import { ExchangeId } from '../../../constants/exchanges.constants';

describe('Kraken spot exchange service', () => {
  describe('constructor', () => {
    it('should set exchange id and set defaultExchange', () => {
      const exchangeId = ExchangeId.Kraken;
      const exchange = new KrakenExchangeService();
      expect(exchange.exchangeId).toEqual(exchangeId);
      expect(exchange.defaultExchange.constructor.name).toBe(exchangeId);
    });
  });
});

import { Request, Response, Router } from 'express';
import { Route } from '../constants/routes.constants';
import { HEALTHCHECK_SUCCESS } from '../messages/server.messages';
import { FTXExchangeWSService } from '../services/exchanges/ws/ftx.ws.service';
import { loggingMiddleware } from '../utils/logger.utils';

const router = Router();

// TODO add connected exchanges status
export const checkHealth = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const ftx = new FTXExchangeWSService();

  res.write(
    JSON.stringify({
      message: HEALTHCHECK_SUCCESS
    })
  );
  res.end();
};

export const healthRouter = router.get(
  Route.Health,
  loggingMiddleware,
  checkHealth
);

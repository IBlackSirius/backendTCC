import { Router } from 'express';
import usersRouter from './users.routes';
import draftfireRouter from './draft_fires.routes';
import storagestockRouter from './storage_stocks.routes';
import sessionsRouter from './sessions.routes';
import miningcompanyRouter from './mining_companies.routes';
import miningfieldsRouter from './mining_fields.routes';
import operationsRouter from './operations.routes';

const routes = Router();
routes.use('/users', usersRouter);
routes.use('/mining_companies', miningcompanyRouter);
routes.use('/mining_fields', miningfieldsRouter);
routes.use('/operations', operationsRouter);
routes.use('/drafts', draftfireRouter);
routes.use('/storagestocks', storagestockRouter);
routes.use('/sessions', sessionsRouter);
export default routes;
import { Router } from 'express';
import { getRepository } from 'typeorm';
import CreateDraftFiresService from '../services/CreateDraftFiresService';

import Draft_Fires from '../models/Draft_Fires';
import AppError from '../errors/AppError';

import CheckifBlasterService from '../services/CheckIfBlasterService';

const draftfireRouter = Router();

draftfireRouter.get('/', async (req, res) => {
  const draftfiresRepository = getRepository(Draft_Fires);

  const draftfires = await draftfiresRepository.find();

  return res.json(draftfires);
});

draftfireRouter.get('/:id', async (req, res) => {
  const draftfiresRepository = getRepository(Draft_Fires);
  const { id } = req.params;

  const draftfires = await draftfiresRepository.findOne(id, {
    relations: ['blaster'],
  });

  if (!draftfires) {
    return res.json(new AppError('O Plano de fogo não existe', 404));
  }

  return res.json(draftfires);
});

draftfireRouter.post('/', async (req, res) => {
  const { blaster_id } = req.body;

  const checkifBlasterService = new CheckifBlasterService();

  const isBlaster = await checkifBlasterService.execute({ blaster_id });

  if (!isBlaster) {
    return res.json(new AppError('O usuário não é Blaster ou não existe', 400));
  }

  const createDraftFire = new CreateDraftFiresService();

  const draft_fire = await createDraftFire.execute({ blaster_id });

  return res.json(draft_fire);
});

draftfireRouter.put('/:id', async (req, res) => {
  const draftfiresRepository = getRepository(Draft_Fires);

  const { id } = req.params;
  const { blaster_id } = req.body;

  const checkifBlasterService = new CheckifBlasterService();

  const isBlaster = await checkifBlasterService.execute({ blaster_id });

  if (!isBlaster) {
    return res.json(new AppError('O usuário não é Blaster ou não existe', 400));
  }

  const draftfires = await draftfiresRepository.findOne(id);

  if (!draftfires) {
    return res.json(new AppError('O Plano de fogo não existe', 404));
  }
  await draftfiresRepository.update(id, { blaster_id });

  return res.json({ message: 'O Plano de fogo foi designado para outro User' });
});

draftfireRouter.delete('/:id', async (req, res) => {
  const draftfiresRepository = getRepository(Draft_Fires);
  const { id } = req.params;

  const draftfires = await draftfiresRepository.findOne(id);

  if (!draftfires) {
    return res.json(new AppError('O Plano de fogo não existe', 404));
  }
  await draftfiresRepository.delete(id);

  return res.json({ message: 'O Plano de Fogo foi deletado' });
});

export default draftfireRouter;

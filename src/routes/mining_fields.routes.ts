import { Router } from 'express';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import CreateMiningField from '../services/CreateMiningFieldService';

import Mining_Fields from '../models/Mining_Fields';

const miningfieldsRouter = Router();

miningfieldsRouter.get('/', async (req, res) => {
  const miningfieldRepository = getRepository(Mining_Fields);

  const miningfields = await miningfieldRepository.find();

  return res.json(miningfields);
});

miningfieldsRouter.get('/:id', async (req, res) => {
  const miningfieldRepository = getRepository(Mining_Fields);

  const { id } = req.params;

  const miningfields = await miningfieldRepository.findOne(id);

  if (!miningfields) {
    return res.json(new AppError('Não existe esse Campo de Mineração', 404));
  }

  return res.json(miningfields);
});

miningfieldsRouter.post('/', async (req, res) => {
  const createMiningField = new CreateMiningField();

  const { plus_code } = req.body;

  const miningField = await createMiningField.execute({ plus_code });

  return res.json(miningField);
});

miningfieldsRouter.put('/:id', async (req, res) => {
  const miningfieldRepository = getRepository(Mining_Fields);

  const { id } = req.params;

  const findminingfield = await miningfieldRepository.findOne(id);

  if (!findminingfield) {
    return res.json(new AppError('Campo de Mineração não cadastrado', 404));
  }
  const { plus_code } = req.body;

  await miningfieldRepository.update(id, { plus_code });

  return res.json({ message: 'Campo de mineração atualizado' });
});

miningfieldsRouter.delete('/:id', async (req, res) => {
  const miningfieldRepository = getRepository(Mining_Fields);

  const { id } = req.params;

  const findminingfield = await miningfieldRepository.findOne(id);

  if (!findminingfield) {
    return res.json(new AppError('Campo de Mineração não cadastrado', 404));
  }

  await miningfieldRepository.delete(id);

  return res.json({ message: 'Campo de Mineração deletado' });
});

export default miningfieldsRouter;

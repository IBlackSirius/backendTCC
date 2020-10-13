import { Router } from 'express';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Mining_Companies from '../models/Mining_Companies';
import CreateMiningCompanyService from '../services/CreateMiningCompaniesService';

const miningcompanyRouter = Router();

miningcompanyRouter.get('/', async (req, res) => {
  const miningcompanyRepository = getRepository(Mining_Companies);

  const miningcompanies = await miningcompanyRepository.find();

  return res.json(miningcompanies);
});

miningcompanyRouter.post('/', async (req, res) => {
  const { name, address, email, cnpj } = req.body;
  const createMiningCompanyService = new CreateMiningCompanyService();

  const miningCompany = await createMiningCompanyService.excute({
    name,
    address,
    email,
    cnpj,
  });

  return res.json(miningCompany);
});

miningcompanyRouter.get('/:id', async (req, res) => {
  const miningcompanyRepository = getRepository(Mining_Companies);

  const miningcompanies = await miningcompanyRepository.findOne(req.params.id);

  return res.json(miningcompanies);
});

miningcompanyRouter.put('/:id', async (req, res) => {
  const miningcompanyRepository = getRepository(Mining_Companies);
  const { id } = req.params;

  const findMiningCompany = await miningcompanyRepository.findOne(id);

  if (!findMiningCompany) {
    return res.json(new AppError('A companhia de mineração não existe', 404));
  }
  await miningcompanyRepository.update(id, req.body);

  return res.json({ message: 'A companhia foi alterada com Sucesso' });
});

miningcompanyRouter.delete('/:id', async (req, res) => {
  const miningcompanyRepository = getRepository(Mining_Companies);
  const { id } = req.params;

  const findMiningCompany = await miningcompanyRepository.findOne(id);

  if (!findMiningCompany) {
    return res.json(new AppError('A companhia de mineração não existe', 404));
  }

  await miningcompanyRepository.delete(id);

  return res.json({ message: 'Compania de Mineração deletada' });
});

export default miningcompanyRouter;

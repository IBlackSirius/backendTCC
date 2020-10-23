import { Router } from 'express';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Mining_Company from '../models/Mining_Companies';
import Mining_Field from '../models/Mining_Fields';
import Operations from '../models/Operations';
import CheckIfOperationHasDependencyService from '../services/CheckIfOperationHasDependencyService';
import CreateOperationService from '../services/CreateOperationService';

const operationsRouter = Router();

operationsRouter.get('/', async (req, res) => {
  const operationsRepository = getRepository(Operations);

  const operations = await operationsRepository.find({
    relations: ['mining_company', 'mining_field'],
  });

  return res.json(operations);
});

operationsRouter.get('/:id', async (req, res) => {
  const operationsRepository = getRepository(Operations);

  const { id } = req.params;

  const operations = await operationsRepository.findOne(id, {
    relations: ['mining_company', 'mining_field'],
  });

  if (!operations) {
    const err = new AppError('Operação inexistente', 404);

    return res.status(err.statusCode).json({ err: err.message });
  }

  return res.json(operations);
});

operationsRouter.post('/', async (req, res) => {
  const createOperationService = new CreateOperationService();

  const mining_companyRepository = getRepository(Mining_Company);

  const mining_fieldRepository = getRepository(Mining_Field);

  const { mining_company_id, status, mining_field_id } = req.body;

  const mining_company = await mining_companyRepository.findOne(
    mining_company_id,
  );

  if (!mining_company) {
    return res.json(new AppError('A Compania de Mineração não existe', 404));
  }

  const mining_field = await mining_fieldRepository.findOne(mining_field_id);

  if (!mining_field) {
    return res.json(new AppError('O Campo de mineração não existe', 404));
  }

  const operation = await createOperationService.execute({
    mining_company_id,
    status,
    mining_field_id,
  });

  return res.json(operation);
});

operationsRouter.put('/:id', async (req, res) => {
  const operationsRepository = getRepository(Operations);

  const { id } = req.params;

  const operations = await operationsRepository.findOne(id);

  if (!operations) {
    return res.json(new AppError('Operação inexistente', 404));
  }

  const checkIfOperationHasDependencyService = new CheckIfOperationHasDependencyService();

  const hasDependency = checkIfOperationHasDependencyService.execute({
    operations_id: id,
  });

  if (!hasDependency) {
    return res.json(new AppError('Operação já possui Planos de Fogo', 400));
  }

  await operationsRepository.update(id, req.body);

  return res.json({ message: 'A Operação foi alterada' });
});

operationsRouter.delete('/:id', async (req, res) => {
  const operationsRepository = getRepository(Operations);

  const { id } = req.params;

  const operations = await operationsRepository.findOne(id);

  if (!operations) {
    return res.json(new AppError('Operação inexistente', 404));
  }

  const checkIfOperationHasDependencyService = new CheckIfOperationHasDependencyService();

  const hasDependency = checkIfOperationHasDependencyService.execute({
    operations_id: id,
  });

  if (!hasDependency) {
    return res.json(new AppError('Operação já possui Planos de Fogo', 400));
  }
  await operationsRepository.delete(id);

  return res.json({ message: 'Operação deletada com Sucesso' });
});

export default operationsRouter;

import { Router } from 'express';
import { getRepository } from 'typeorm';
import Operations_Draftfires from '../models/Operations_Draftfires';
import CreateOperationDraftFiresService from '../services/CreateOperationDraftFiresService';
import CheckOperations_DraftfiresService from '../services/CheckOperations_DraftfiresService';

const operationsdraftfiresRouter = Router();

operationsdraftfiresRouter.get('/', async (req, res) => {
  const operations_DraftFiresRepositoy = getRepository(Operations_Draftfires);

  const operations_draftfires = await operations_DraftFiresRepositoy.find({
    relations: ['operations', 'draftfires'],
  });
  return res.json(operations_draftfires);
});

operationsdraftfiresRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const operations_DraftfiresRepository = getRepository(Operations_Draftfires);

  const operations_Draftfires = await operations_DraftfiresRepository.findOne(
    id,
    {
      relations: ['operations', 'draftfires', 'boxes'],
    },
  );

  if (!operations_Draftfires) {
    return res.json({ message: 'Operação Draft Fire não existe' });
  }
  return res.json(operations_Draftfires);
});

operationsdraftfiresRouter.post('/', async (req, res) => {
  const createOperationDraftFiresService = new CreateOperationDraftFiresService();

  const checkOperations_DraftfiresService = new CheckOperations_DraftfiresService();

  const { operation_id, draftfires_id, boxes_id } = req.body;

  if (!operation_id || !draftfires_id || !boxes_id) {
    return res.json({ message: 'Campos vazios' });
  }
  const checkOperationsFields = await checkOperations_DraftfiresService.execute(
    { operation_id, draftfires_id, boxes_id },
  );
  if (!checkOperationsFields) {
    return res.json({ message: 'Operação invalida' });
  }

  const operations_draftfires = await createOperationDraftFiresService.execute({
    operation_id,
    draftfires_id,
    boxes_id,
  });

  return res.json(operations_draftfires);
});

operationsdraftfiresRouter.put('/:id', async (req, res) => {
  const operations_DraftfiresRepository = getRepository(Operations_Draftfires);
  const { id } = req.params;
  const checkOperations_DraftfiresService = new CheckOperations_DraftfiresService();

  const { operation_id, draftfires_id, boxes_id } = req.body;

  if (!operation_id || !draftfires_id || !boxes_id) {
    return res.json({ message: 'Campos vazios' });
  }

  const checkOperationsFields = await checkOperations_DraftfiresService.execute(
    { operation_id, draftfires_id, boxes_id },
  );
  if (!checkOperationsFields) {
    return res.json({ message: 'Operação invalida' });
  }

  await operations_DraftfiresRepository.update(id, req.body);

  return res.json({ message: 'Alterado com sucesso!' });
});

operationsdraftfiresRouter.delete('/:id', async (req, res) => {
  const operations_DraftfiresRepository = getRepository(Operations_Draftfires);
  const { id } = req.params;

  const operations_draftfires = await operations_DraftfiresRepository.findOne(
    id,
  );
  if (!operations_draftfires) {
    return res.json({ message: 'Operação Draft Fire não encontrada' });
  }
  await operations_DraftfiresRepository.delete(id);
  return res.json({ message: 'Operação Draft Fire deletada com sucesso ' });
});

export default operationsdraftfiresRouter;

import { getRepository } from 'typeorm';
import Operations from '../models/Operations';

interface Request {
  mining_company_id: string;
  mining_field_id: string;
  status: string;
}

export default class CreateOperationService {
  public async execute({
    mining_company_id,
    status,
    mining_field_id,
  }: Request): Promise<Operations> {
    const operationRepository = getRepository(Operations);

    const operation = operationRepository.create({
      mining_field_id,
      mining_company_id,
      status,
    });

    await operationRepository.save(operation);

    return operation;
  }
}

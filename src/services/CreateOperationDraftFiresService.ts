import { getRepository } from 'typeorm';
import Operations_Draftfires from '../models/Operations_Draftfires';

interface Request {
  operation_id: string;
  draftfires_id: string;
  boxes_id: string;
}

export default class CreateOperationDraftFiresService {
  public async execute({
    operation_id,
    draftfires_id,
    boxes_id,
  }: Request): Promise<Operations_Draftfires> {
    const Operations_DraftfiresRepository = getRepository(
      Operations_Draftfires,
    );

    const operations_Draftfires = Operations_DraftfiresRepository.create({
      boxes_id,
      draftfires_id,
      operation_id,
    });

    await Operations_DraftfiresRepository.save(operations_Draftfires);
    return operations_Draftfires;
  }
}

import { getRepository } from 'typeorm';
import { boolean } from 'yup';
import AppError from '../errors/AppError';
import Operations_Draftfires from '../models/Operations_Draftfires';

interface Request {
  operations_id: string;
}

export default class CheckIfOperationHasDependencyService {
  public async execute({ operations_id }: Request): Promise<boolean> {
    const operations_draftfiresRepository = getRepository(
      Operations_Draftfires,
    );

    const operations_draftfires = await operations_draftfiresRepository.findOne(
      {
        where: {
          operations_id,
        },
      },
    );

    if (operations_draftfires) {
      return true;
    }
    return false;
  }
}

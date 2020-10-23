import { getRepository } from 'typeorm';
import Operations_Draftfires from '../models/Operations_Draftfires';
import Operations from '../models/Operations';
import Boxes from '../models/Boxes';
import Draft_Fires from '../models/Draft_Fires';

interface Request {
  operation_id: string;
  draftfires_id: string;
  boxes_id: string;
}

export default class CheckOperations_DraftfiresService {
  public async execute({
    operation_id,
    draftfires_id,
    boxes_id,
  }: Request): Promise<boolean> {
    const Operations_DraftfiresRepository = getRepository(
      Operations_Draftfires,
    );
    const OperationsRepository = getRepository(Operations);
    const BoxesRepository = getRepository(Boxes);
    const Draft_FiresRepository = getRepository(Draft_Fires);

    const operation = await OperationsRepository.findOne(operation_id);
    if (!operation) {
      return false;
    } // checa caso exista na tabela propria

    const box = await BoxesRepository.findOne(boxes_id);
    if (!box) {
      return false;
    } // checa caso exista na tabela propria

    const draftfires = await Draft_FiresRepository.findOne(draftfires_id);
    if (!draftfires) {
      return false;
    } // checa caso exista na tabela propria

    const draftInOperation = await Operations_DraftfiresRepository.findOne({
      where: { draftfires_id },
    });

    if (draftInOperation) {
      return false;
    } // checa caso ja esteja em outra operação

    const boxInDraft = await Operations_DraftfiresRepository.findOne({
      where: { boxes_id },
    });

    if (boxInDraft) {
      return false;
    } // checa caso ja esteja em outro Plano de fogo

    const operations_draftfires = await Operations_DraftfiresRepository.findOne(
      {
        operation_id,
        draftfires_id,
        boxes_id,
      },
    );

    return !operations_draftfires;
  }
}

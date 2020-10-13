import { getRepository } from 'typeorm';
import Draft_Fires from '../models/Draft_Fires';

interface Request {
  blaster_id: string;
}

class CreateDraftFiresService {
  public async execute({ blaster_id }: Request): Promise<Draft_Fires> {
    const draftfiresRepository = getRepository(Draft_Fires);

    const draftfire = draftfiresRepository.create({
      blaster_id,
    });

    await draftfiresRepository.save(draftfire);

    return draftfire;
  }
}
export default CreateDraftFiresService;

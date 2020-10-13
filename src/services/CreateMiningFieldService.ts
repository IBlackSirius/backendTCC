import { getRepository } from 'typeorm';
import Mining_Fields from '../models/Mining_Fields';

interface Request {
  plus_code: string;
}
class CreateMiningFieldService {
  public async execute({ plus_code }: Request): Promise<Mining_Fields> {
    const miningfieldRepository = getRepository(Mining_Fields);

    const miningField = miningfieldRepository.create({
      plus_code,
    });

    await miningfieldRepository.save(miningField);

    return miningField;
  }
}
export default CreateMiningFieldService;

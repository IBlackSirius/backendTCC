import { getRepository } from 'typeorm';
import Mining_Companies from '../models/Mining_Companies';

interface Request {
  name: string;
  address: string;
  email: string;
  cnpj: string;
}

export default class CreateMiningCompanyService {
  public async excute({
    name,
    address,
    email,
    cnpj,
  }: Request): Promise<Mining_Companies | boolean> {
    const miningcompanyRepository = getRepository(Mining_Companies);

    const check = await miningcompanyRepository.findOne({ where: { email } });
    if (!check) {
      const miningCompany = miningcompanyRepository.create({
        name,
        address,
        email,
        cnpj,
      });

      await miningcompanyRepository.save(miningCompany);
      return miningCompany;
    }
    return false;
  }
}

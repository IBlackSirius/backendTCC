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
  }: Request): Promise<Mining_Companies> {
    const miningcompanyRepository = getRepository(Mining_Companies);

    const miningCompany = miningcompanyRepository.create({
      name,
      address,
      email,
      cnpj,
    });

    await miningcompanyRepository.save(miningCompany);

    return miningCompany;
  }
}

import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  address: string;
  cep: string;
  email: string;
  password: string;
  type: string;
  cpf: string;
}

class CreateUserService {
  public async execute({
    name,
    address,
    cep,
    email,
    password,
    type,
    cpf,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkEmail = await usersRepository.findOne({
      where: { email },
    });

    if (checkEmail) {
      throw new AppError('Email address already used.').message;
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      address,
      cep,
      email,
      password: hashedPassword,
      type,
      cpf,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;

import { Router } from 'express';
import { getRepository } from 'typeorm';
import CreateUserService from '../services/CreateUserService';
import User from '../models/User';
import AppError from '../errors/AppError';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

usersRouter.use(ensureAuthenticated);

usersRouter.post('/', async (req, res) => {
  const { name, email, password, address, cep, cpf, type } = req.body;

  const createuUser = new CreateUserService();

  const { created_at, updated_at } = await createuUser.execute({
    name,
    address,
    cep,
    email,
    password,
    type,
    cpf,
  });

  return res.json({
    name,
    email,
    password,
    address,
    cep,
    cpf,
    type,
    created_at,
    updated_at,
  });
});

usersRouter.get('/', async (req, res) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.find({
    select: ['id', 'name', 'email', 'cep', 'address', 'type'],
  });

  return res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.findOne(req.params.id, {
    select: ['id', 'name', 'email', 'cep', 'address', 'type'],
  });

  return res.json(users);
});

usersRouter.delete('/:id', async (req, res) => {
  const usersRepository = getRepository(User);

  const { id } = req.params;

  const user = await usersRepository.findOne({ id });

  if (!user) {
    throw new AppError(`O usuário não existe`, 400).message;
  }
  await usersRepository.delete(id);

  return res.json({ message: 'o usuário foi deletado' });
});

usersRouter.put('/:id', async (req, res) => {
  const usersRepository = getRepository(User);
  const { id } = req.params;

  const user = await usersRepository.findOne({ id });

  if (!user) {
    throw new AppError(`O usuário não existe`, 400).message;
  }

  await usersRepository.update(id, req.body);

  return res.json({ message: 'usuário alterado' });
});

export default usersRouter;

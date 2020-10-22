import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, token, status, message } = await authenticateUser.execute({
    email,
    password,
  });
  if (message) {
    return response.json({ message, status });
  }
  if (user) {
    delete user.password;
  }

  return response.json({ user, token, status });
});

export default sessionsRouter;

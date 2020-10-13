import { getRepository } from 'typeorm';

import Users from '../models/User';

interface Request {
  blaster_id: string;
}

class CheckifBlasterService {
  public async execute({ blaster_id }: Request): Promise<boolean> {
    const usersRepository = getRepository(Users);

    const blaster = await usersRepository.findOne({
      where: {
        id: blaster_id,
      },
    });

    if (!blaster) {
      return false;
    }

    return blaster.type === 'Blaster';
  }
}
export default CheckifBlasterService;

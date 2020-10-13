import { getRepository, Like } from 'typeorm';
import Register from '../models/Storage_Stocks_Register';
import Boxes from '../models/Boxes';
import AppError from '../errors/AppError';

interface Request {
  fileName: string;
  boxes: [
    {
      barcode: string;
      quantity_products: number;
      products: unknown[];
      status: string;
    },
  ];
}
class CheckIfAlreadyRegistered {
  public async execute({ fileName, boxes }: Request): Promise<void> {
    const storageRepository = getRepository(Boxes);
    const registerRepository = getRepository(Register);

    const fileNameSplit = fileName.split('-')[1];

    const registered = await registerRepository.findOne({
      where: {
        fileName: Like(fileNameSplit),
      },
    });
    if (registered) {
      throw new AppError('Esse arquivo ja foi cadastrado').message;
    }

    // tenho que comparar se ele possui um estado de uso, buscando por barcode
    // verificando os status

    const promises = boxes.map(async ({ barcode }) => {
      const boxRepository = await storageRepository.findOne({ where: barcode });
      if (boxRepository?.status === 'inDraft') {
        throw new AppError('Essa Caixa esta em Operação').message;
      }
    });
    await Promise.all(promises);
  }
}
export default CheckIfAlreadyRegistered;

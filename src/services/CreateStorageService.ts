import { getRepository } from 'typeorm';
import Register from '../models/Storage_Stocks_Register';
import Boxes from '../models/Boxes';

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

class CreateStorageService {
  public async execute({
    fileName,
    boxes,
  }: Request): Promise<{
    Register: Register;
    Boxes: Array<{
      barcode: string;
      quantity_products: number;
      products: unknown[];
      status: string;
    }>;
  }> {
    const storageRepository = getRepository(Boxes);
    const registerRepository = getRepository(Register);

    const boxesString = JSON.stringify(boxes);

    const register = registerRepository.create({
      boxes: boxesString,
      fileName,
    });

    const arrBox = new Array<Boxes>();

    boxes.map(({ barcode, products, quantity_products, status }) => {
      const productsString = JSON.stringify(products);

      const box = storageRepository.create({
        barcode,
        quantity_products,
        products: productsString,
        status,
      });
      return arrBox.push(box);
    });

    await storageRepository.save(arrBox);

    await registerRepository.save(register);

    return {
      Register: register,
      Boxes: boxes,
    };
  }
}
export default CreateStorageService;

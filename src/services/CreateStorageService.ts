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
    Boxes: Array<{
      barcode: string;
      quantity_products: number;
      products: unknown[];
      status: string;
    }>;
  }> {
    const storageRepository = getRepository(Boxes);
    const registerRepository = getRepository(Register);

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

    await storageRepository.save(arrBox).then(async data => {
      const boxesString = JSON.stringify(data);
      const register = registerRepository.create({
        boxes: boxesString,
        fileName,
      });
      await registerRepository.save(register);
    });

    return {
      Boxes: boxes,
    };
  }
}
export default CreateStorageService;

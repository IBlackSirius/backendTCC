/* eslint-disable consistent-return */
import Boxes from '../models/Boxes';
import Products from '../models/Products';
import AppError from '../errors/AppError';

interface Request {
  barcode: string;
  quantity_products: number;
  products: [{ barcode: string; type: string; name: string; status: string }];
}

class CheckisValidService {
  boxes = new Boxes();

  public async executeFile(
    { barcode, quantity_products, products }: Request,
    filename: string,
  ): Promise<void> {
    const boxValid = await this.boxes.boxes_yup().isValid({
      barcode,
      quantity_products,
      products,
    });

    if (!boxValid) {
      throw new AppError(`O Arquivo ${filename} está com problemas`, 400)
        .message;
      console.log('Yup fail');
    }

    const promises = products.map(async element => {
      const productValid = await Products.isValid(element);

      if (!productValid) {
        throw new AppError(`O Arquivo ${filename} está com problemas`, 400)
          .message;
        console.log('Yup fail Produtoc');
      }
      // eslint-disable-next-line no-param-reassign
      element.status = 'lacrado';
    });
    await Promise.all(promises);
  }

  public async execute({
    barcode,
    quantity_products,
    products,
  }: Request): Promise<void> {
    const boxValid = await this.boxes.boxes_yup().isValid({
      barcode,
      quantity_products,
      products,
    });

    if (!boxValid) {
      throw new AppError(`A caixa está com problemas`, 400).message;
      console.log('Yup fail Produtoc');
    }

    const promises = products.map(
      async (element: {
        barcode: string;
        type: string;
        name: string;
        status: string;
      }) => {
        const productValid = await Products.isValid(element);

        if (!productValid) {
          throw new AppError(`A caixa está com problemas`, 400).message;
        }
        if (!element.status) {
          // eslint-disable-next-line no-param-reassign
          element.status = 'lacrado';
        }
      },
    );
    await Promise.all(promises);
  }
}
export default CheckisValidService;

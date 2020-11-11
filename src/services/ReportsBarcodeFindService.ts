/* eslint-disable consistent-return */
import { getRepository } from 'typeorm';
import Boxes from '../models/Boxes';
import Register from '../models/Storage_Stocks_Register';

export default class ReportsBarcodeFind {
  public async execute(barcode: string): Promise<unknown> {
    const storageRepository = getRepository(Boxes);
    const registerRepository = getRepository(Register);
    const tryboxes = await storageRepository.findOne({
      where: {
        barcode,
      },
    });
    if (tryboxes) {
      return tryboxes;
    }
    const allboxes = await storageRepository.find();
    if (allboxes) {
      const arrProducts = allboxes.map(box => {
        const products = JSON.parse(box.products);
        return products;
      });

      const tryproducts = arrProducts.map(arrOfProducts => {
        return arrOfProducts.find((product: { barcode: string }) => {
          if (product.barcode === barcode) {
            return product;
          }
          return false;
        });
      });

      // eslint-disable-next-line array-callback-return
      const result = tryproducts.find(el => {
        if (el) {
          return el;
        }
      });
      if (result) {
        return result;
      }
    }

    const allRegister = await registerRepository.find();

    const findInRegister = allRegister.map(register => {
      const boxesRegister = JSON.parse(register.boxes);

      const findBoxregister = boxesRegister.map(
        (box: { barcode: string; products: string; status: string }) => {
          if (box.barcode === barcode) {
            // eslint-disable-next-line no-param-reassign
            box.status = 'usado';
            return box;
          }
          const { products } = box;
          const parsedProducts = JSON.parse(products);
          const findBoxRegister = parsedProducts.find(
            (product: { barcode: string }) => {
              if (product.barcode === barcode) {
                return product;
              }
              return false;
            },
          );

          if (findBoxRegister) {
            return findBoxRegister;
          }
        },
      );

      if (findBoxregister) {
        return findBoxregister;
      }
      return false;
    });
    const found = findInRegister[0].filter(el => el);
    if (found.length > 0) {
      // eslint-disable-next-line no-unused-expressions
      found[0].status = 'usado/descartado';
      if (found[0].quantity_products) {
        const stringproducts = found[0].products;
        const products = JSON.parse(stringproducts);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < products.length; i++) {
          products[i].status = 'usado/descartado';
        }
        found[0].products = products;
      }

      return found[0];
    }

    return { message: 'Barcode não encontrado' };
  }
}

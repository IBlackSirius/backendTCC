import { getRepository } from 'typeorm';

import Boxes from '../models/Boxes';
import OperationsDraft from '../models/Operations_Draftfires';
import DraftFires from '../models/Draft_Fires';
import User from '../models/User';
import Register from '../models/Storage_Stocks_Register';

export default class ReportsAllBoxesPerDraftFireService {
  storageRepository = getRepository(Boxes);

  registerRepository = getRepository(Register);

  userRepository = getRepository(User);

  DraftFiresRepository = getRepository(DraftFires);

  OperationsDraftRepository = getRepository(OperationsDraft);

  // eslint-disable-next-line consistent-return
  public async execute(id: string): Promise<unknown> {
    const arrObjectBoxesId = await this.OperationsDraftRepository.find({
      where: { draftfires_id: id },
      select: ['boxes_id'],
    });
    const arrBoxesId: string[] = [];

    arrObjectBoxesId.forEach(element => {
      arrBoxesId.push(element.boxes_id);
    });

    const boxesInStorage = await this.storageRepository.findByIds(arrBoxesId);
    const boxesUsed: unknown[] = [];
    if (boxesInStorage.length !== 0) {
      if (boxesInStorage.length === arrBoxesId.length) {
        return boxesInStorage;
      }

      arrBoxesId.forEach(element => {
        const trybox = boxesInStorage.findIndex(box => box.id === element);
        if (trybox === -1) {
          boxesUsed.push(element);
        }
      });
      const returnBoxesfind: unknown[] = [];
      returnBoxesfind.push(...boxesInStorage);
      const findboxInRegister = await this.findBoxesInRegister(boxesUsed);

      if (Array.isArray(findboxInRegister)) {
        const arrUsedBox: Boxes[] = [];
        findboxInRegister.forEach(box => {
          const usedBox = new Boxes();
          usedBox.id = box.id;
          usedBox.barcode = box.barcode;
          usedBox.quantity_products = box.quantity_products;
          usedBox.products = box.products;
          usedBox.status = box.status;
          usedBox.created_at = box.created_at;
          usedBox.updated_at = box.updated_at;
          arrUsedBox.push(usedBox);
        });
        returnBoxesfind.push(...arrUsedBox);
      }

      // eslint-disable-next-line no-return-await
      return returnBoxesfind;
    }
    // eslint-disable-next-line no-return-await
    return await this.findBoxesInRegister(arrBoxesId);
  }

  // eslint-disable-next-line consistent-return
  public async findBoxesInRegister(arrBoxesId: unknown[]): Promise<unknown> {
    const allRegister = await this.registerRepository.find();
    const boxesPerRegister = allRegister.map(register => {
      const boxesRegister = JSON.parse(register.boxes);
      return boxesRegister;
    });

    let allBoxes: any[] = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < boxesPerRegister.length; i++) {
      const boxes = boxesPerRegister[i];
      allBoxes = [...boxes];
    }
    if (allBoxes) {
      const returnBoxes = [];
      // eslint-disable-next-line no-plusplus
      for (let y = 0; y < allBoxes.length; y++) {
        const box = allBoxes[y];
        if (arrBoxesId.indexOf(box.id) >= 0) {
          returnBoxes.push(box);
        }
      }
      returnBoxes.forEach(element => {
        // eslint-disable-next-line no-param-reassign
        element.status = 'usado/descartado';
        const products = JSON.parse(element.products);

        products.forEach((product: { status: string }) => {
          // eslint-disable-next-line no-param-reassign
          product.status = 'usado/descartado';
        });
        // eslint-disable-next-line no-param-reassign
        element.products = JSON.stringify(products);
      });
      return returnBoxes;
    }
    return null;
  }
}

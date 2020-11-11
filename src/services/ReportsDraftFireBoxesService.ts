import { getRepository } from 'typeorm';

import Boxes from '../models/Boxes';
import OperationsDraft from '../models/Operations_Draftfires';
import DraftFires from '../models/Draft_Fires';
import User from '../models/User';
import Register from '../models/Storage_Stocks_Register';

export default class ReportsDraftFireBoxesService {
  storageRepository = getRepository(Boxes);

  registerRepository = getRepository(Register);

  userRepository = getRepository(User);

  DraftFiresRepository = getRepository(DraftFires);

  OperationsDraftRepository = getRepository(OperationsDraft);

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async execute(name_id: string): Promise<unknown> {
    const userFind = await this.userRepository
      .findOne({
        where: { id: name_id },
      })
      .catch(async () => {
        const userFind_name = await this.userRepository.findOne({
          where: { email: name_id },
        });
        return userFind_name;
      });

    if (userFind) {
      if (userFind.type === 'Blaster') {
        const draftfires = await this.returnAllDraft(userFind.id);

        if (Array.isArray(draftfires)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const promises = draftfires.map(async el => {
            const arr = await this.returnAllBoxPerDraft(el);
            return { draftfire_id: el.id, boxes: arr };
          });
          const result = await Promise.all(promises).then(data => {
            return data;
          });
          return result;
        }
      }
      return {
        message: 'Usuário não tem Plano de Fogo',
      };
    }
    return { message: 'Usuário não encontrado' };
  }

  public async returnAllDraft(id: string): Promise<DraftFires[] | boolean> {
    const draftfires = await this.DraftFiresRepository.find({
      where: {
        blaster_id: id,
      },
    });

    return draftfires || false;
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

  // eslint-disable-next-line consistent-return
  public async returnAllBoxPerDraft({ id }: DraftFires): Promise<unknown> {
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
      returnBoxesfind.push(...(await this.findBoxesInRegister(boxesUsed)));
      // eslint-disable-next-line no-return-await
      return returnBoxesfind;
    }
    // eslint-disable-next-line no-return-await
    return await this.findBoxesInRegister(arrBoxesId);
  }
}

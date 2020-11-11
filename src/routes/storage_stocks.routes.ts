import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import fs from 'fs';

import Register from '../models/Storage_Stocks_Register';
import Storage from '../models/Boxes';

import CheckIsValidService from '../services/CheckIsValidService';
import CreateStorageService from '../services/CreateStorageService';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

const storageRouter = Router();
const upload = multer(uploadConfig);

storageRouter.get('/', async (req, res) => {
  const storageRepository = getRepository(Storage);

  const boxes = await storageRepository.find({
    select: ['id', 'barcode', 'quantity_products', 'products', 'status'],
    where: { status: 'lacrado' }, // lacrado, usado  Indraft
  });

  return res.json(boxes);
});

storageRouter.get('/:id', async (req, res) => {
  const storageRepository = getRepository(Storage);

  const box = await storageRepository.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!box) {
    return res.json(new AppError('Não foi possivel achar a caixa', 400));
  }

  return res.json(box);
});

storageRouter.get('/Register', async (req, res) => {
  const registerRepository = getRepository(Register);

  const register = await registerRepository.find({
    select: ['fileName', 'boxes'],
  });

  return res.json(register);
});

storageRouter.post('/', upload.single('storage'), async (req, res) => {
  interface Box {
    barcode: string;
    quantity_products: number;
    products: [{ barcode: string; type: string; name: string; status: string }];
    status: string;
  }

  const boxes = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));

  const checkisvalidService = new CheckIsValidService();

  const promises = await boxes.map(async (element: Box) => {
    const { filename } = req.file;

    await checkisvalidService.executeFile(element, filename);
    // eslint-disable-next-line no-param-reassign
    element.quantity_products = element.products.length;
    // eslint-disable-next-line no-param-reassign
    element.status = 'lacrado';
  });

  await Promise.all(promises);

  const create_storageservice = new CreateStorageService();

  create_storageservice.execute({ fileName: req.file.filename, boxes });

  return res.json(boxes);
});

storageRouter.put('/', async (req, res) => {
  const storageRepository = getRepository(Storage);

  const { boxes } = req.body;
  const arrBoxforDelete: string[] = [];
  const findBoxes = await storageRepository.findByIds(
    // eslint-disable-next-line consistent-return
    boxes.map((box: Storage) => {
      if (box.products !== '[]') {
        return box.id;
      }
      arrBoxforDelete.push(box.id);
    }),
  );
  findBoxes.map(async box => {
    await storageRepository.update(
      box.id,
      boxes.find((element: Storage) => {
        return element.id === box.id;
      }),
    );
  });
  if (arrBoxforDelete.length > 0) {
    await storageRepository.delete([...arrBoxforDelete]);
  }

  return res.json({ message: 'As Caixas foram atualizadas' });
});

storageRouter.delete('/:id', async (req, res) => {
  const storageRepository = getRepository(Storage);

  const box = await storageRepository.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!box) {
    throw new AppError('Não foi possivel achar a caixa', 400).message;
  }
  await storageRepository.delete(box.id);

  return res.json({ message: 'A caixa foi deletada' });
});
export default storageRouter;

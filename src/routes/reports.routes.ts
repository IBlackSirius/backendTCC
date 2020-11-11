import { Router } from 'express';
import ReportsBarcodeFind from '../services/ReportsBarcodeFindService';
import ReportsDraftFireBoxesService from '../services/ReportsDraftFireBoxesService';
import ReportsAllBoxesPerDraftFireService from '../services/ReportsAllBoxesPerDraftFireService';
import ReportsAllOperationPerCompany from '../services/ReportsAllOperationPerCompany';

const reportsRouter = Router();

// eslint-disable-next-line consistent-return
reportsRouter.post('/:type', async (req, res) => {
  const { type } = req.params;

  switch (type) {
    case 'Barcode_Find':
      {
        const { barcode } = req.body;
        const reportsBarcodeFind = new ReportsBarcodeFind();
        const resultreport = await reportsBarcodeFind.execute(barcode);
        return res.json([{ table: [resultreport], name: 'Resultado' }]);
      }
      break;
    case 'DraftFire_Boxes':
      {
        const { name_id } = req.body;
        const reportsDraftFireBoxesService = new ReportsDraftFireBoxesService();
        const resultreport = await reportsDraftFireBoxesService.execute(
          name_id,
        );
        return res.json([
          { table: resultreport, name: 'Todos os DraftFires do Usuário' },
        ]);
      }
      break;
    case 'DraftFire_Find':
      {
        const { draft_id } = req.body;
        const reportsAllBoxesPerDraftFireService = new ReportsAllBoxesPerDraftFireService();
        const resultreport = await reportsAllBoxesPerDraftFireService.execute(
          draft_id,
        );
        return res.json([
          { table: resultreport, name: 'Plano de Fogo Encontrado' },
        ]);
      }
      break;
    default:
      return res.json('Nada encotrado');
  }
});

export default reportsRouter;

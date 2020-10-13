import * as yup from 'yup';

const Products = yup.object().shape({
  barcode: yup.string().required(),

  type: yup.string().required(),

  name: yup.string().required(),

  status: yup.string().optional(),
});

export default Products;

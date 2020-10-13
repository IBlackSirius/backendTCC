import * as yup from 'yup';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('storages')
class Boxes {
  public boxes_yup(): yup.ObjectSchema<
    yup.Shape<
      // eslint-disable-next-line @typescript-eslint/ban-types
      object | undefined,
      {
        barcode: string;
        quantity_products: number | undefined;
        products: unknown[];
        status: string | undefined;
      }
    >
  > {
    const boxes = yup.object().shape({
      barcode: yup.string().required(),

      quantity_products: yup.number(),

      products: yup.array().required(),

      status: yup.string(),
    });
    return boxes;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  barcode: string;

  @Column()
  quantity_products: number;

  @Column()
  products: string;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
export default Boxes;

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import Operations from './Operations';
import Draft_Fires from './Draft_Fires';
import Boxes from './Boxes';

@Entity('operations_draftfires')
class Operations_Draftfires {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  operations_id: string;

  @OneToOne(() => Operations)
  @JoinColumn({ name: 'operations_id' })
  operations: Operations;

  @Column()
  draftfires_id: string;

  @OneToOne(() => Draft_Fires)
  @JoinColumn({ name: 'draftfires_id' })
  draftfires: Draft_Fires;

  @Column()
  boxes_id: string;

  @OneToOne(() => Boxes)
  @JoinColumn({ name: 'boxes_id' })
  boxes: Boxes;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
export default Operations_Draftfires;

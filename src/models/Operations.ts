import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import Mining_Company from './Mining_Companies';
import Mining_Field from './Mining_Fields';

@Entity('operations')
class Operations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mining_company_id: string;

  @Column({ name: 'mining_field_id' })
  mining_field_id: string;

  @Column()
  status: string;

  @OneToOne(() => Mining_Company)
  @JoinColumn({ name: 'mining_company_id', referencedColumnName: 'id' })
  mining_company: Mining_Company;

  @OneToOne(() => Mining_Field)
  @JoinColumn({ name: 'mining_field_id', referencedColumnName: 'id' })
  mining_field: Mining_Field;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
export default Operations;

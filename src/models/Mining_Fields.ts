import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mining_fields')
class Mining_Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plus_code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
export default Mining_Field;

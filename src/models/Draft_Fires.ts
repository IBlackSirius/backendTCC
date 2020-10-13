import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import User from './User';

@Entity('draftfires')
class Draft_Fires {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  blaster_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'blaster_id' })
  blaster: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
export default Draft_Fires;

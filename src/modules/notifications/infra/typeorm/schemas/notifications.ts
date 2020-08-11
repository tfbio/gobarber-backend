import {
  ObjectIdColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ObjectId } from 'mongodb';

@Entity('notifications')
class Notifications {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  content: string;

  @Column('uuid')
  recipient_id: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Notifications;

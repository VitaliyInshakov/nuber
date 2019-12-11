import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from "typeorm";

import Chat from "./Chat";
import User from "./User";

@Entity()
class Message extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => Chat, chat => chat.messages)
  chat: Chat;

  @ManyToOne(type => User, user => user.messages)
  user: User[];

  @Column({type: "text"})
  text: string;
  
  @CreateDateColumn() createdAt: string;

  @UpdateDateColumn() updatedAt: string;
}

export default Message;
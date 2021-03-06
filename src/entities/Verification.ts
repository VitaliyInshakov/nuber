import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { verificationTarget } from "src/types/types";

const PHONE = "PHONE";
const EMAIL = "EMAIL";

@Entity()
class Verification extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({type: "text", enum: [PHONE, EMAIL]})
  target: verificationTarget;

  @Column({type: "text"})
  payload: string;

  @Column({type: "text"})
  key: string;

  @Column({type: "boolean", default: false})
  verified: boolean;
  
  @CreateDateColumn() createdAt: string;
  
  @UpdateDateColumn() updatedAt: string;

  @BeforeInsert()
  createKey(): void {
      this.key = this.target === PHONE 
      ? Math.floor(Math.random() * 100000).toString()
      : Math.random().toString(36).substr(2);
  }
}

export default Verification;
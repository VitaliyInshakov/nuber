import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { IsEmail } from "class-validator";
import bcrypt from "bcrypt";
import Chat from "./Chat";
import Message from "./Message";
import Ride from "./Ride";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({type: "text", nullable: true})
  @IsEmail()
  email: string | null;

  @Column({type: "boolean", default: false})
  verifiedEmail: boolean;

  @Column({type: "text"})
  firstName: string;

  @Column({type: "text"})
  lastName: string;

  @Column({type: "int", nullable: true})
  age: number;

  @Column({type: "text", nullable: true})
  password: string;

  @Column({type: "text", nullable: true})
  phoneNumber: string;

  @Column({type: "boolean", default: false})
  verifiedPhoneNumber: boolean;

  @Column({type: "text", nullable: true})
  fbId: string;

  @Column({type: "text"})
  profilePhoto: string;

  @CreateDateColumn() createdAt: string;
  
  @UpdateDateColumn() updatedAt: string;

  @Column({type: "boolean", default: false})
  isDriving: boolean;

  @Column({type: "boolean", default: false})
  isRiding: boolean;

  @Column({type: "boolean", default: false})
  isTaken: boolean;

  @Column({type: "double precision", default: 0})
  lastLng: number;

  @Column({type: "double precision", default: 0})
  lastLat: number;

  @Column({type: "double precision", default: 0})
  lastOrientation: number;

  @ManyToOne(type => Chat, chat => chat.participants)
  chat: Chat;

  @OneToMany(type => Message, message => message.user)
  messages: Message[];

  @OneToMany(type => Ride, ride => ride.passenger)
  rideAsPassenger: Ride[]

  @OneToMany(type => Ride, ride => ride.driver)
  rideAsDriver: Ride[]

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }
}

export default User;
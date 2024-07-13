import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn,OneToMany } from 'typeorm';
import { Info } from './Info.entity';
import { Login } from './Login.entity';
import { Feedback } from './Feedback.entity';
import { TicketBookInfo } from './TicketBookInfo.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Info)
  @JoinColumn()
  info: Info;

  @OneToOne(() => Login)
  @JoinColumn()
  login: Login;

  @OneToMany(() => Feedback, feedback => feedback.customer)
  feedbacks: Feedback[];

  @OneToMany(() => TicketBookInfo, ticketBook => ticketBook.customers)
  ticketBooks: TicketBookInfo[];
}

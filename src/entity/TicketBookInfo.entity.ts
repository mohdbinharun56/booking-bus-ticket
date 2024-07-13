import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Ticket } from './Ticket.entity';
import { Customer } from './Customer.entity';

@Entity()
export class TicketBookInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  seatNumberInBus: number;

  @Column()
  status: string;

  @Column()
  totalPrice: number;

  @Column()
  bookedSeats: number;

  @ManyToOne(() => Ticket)
  ticket: Ticket;

  @ManyToMany(() => Customer)
  @JoinTable()
  customers: Customer[];
}

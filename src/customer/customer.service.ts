import { HttpStatus, Injectable, NotFoundException, Session, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entity/Customer.entity';
import { Info } from 'src/entity/Info.entity';
import { Not, Repository } from 'typeorm';
import { BookTicketDTO, CustoomerDTo, FeedbackDTO, InfoDTo, ReportDTO } from './customer.dto';
import { Login } from 'src/entity/Login.entity';
import { Feedback } from 'src/entity/Feedback.entity';
import { Notification, Report, Ticket, TicketBookInfo } from 'src/entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private customerrepo: Repository<Customer>,
    @InjectRepository(Login) private loginrepo: Repository<Login>,
    @InjectRepository(Info) private inforepo: Repository<Info>,
    @InjectRepository(Feedback) private feedbackrepo: Repository<Feedback>,
    @InjectRepository(Ticket) private ticketrepo: Repository<Ticket>,
    @InjectRepository(TicketBookInfo) private bookticketrepo: Repository<TicketBookInfo>,
    @InjectRepository(Notification) private notificationrepo: Repository<Notification>,
    @InjectRepository(Report) private reportrepo: Repository<Report>

  ) { }

  async createCustomer(infoid: string, customerDto: CustoomerDTo): Promise<Customer> {
    const info = await this.inforepo.findOne({ where: { id: infoid } });
    if (!info) {
      throw new NotFoundException(`Info with id ${infoid} not found`);
    }
    const { login: { passHash } } = customerDto;

    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(passHash, salt);

    customerDto.login.passHash = hashedpassword;

    const login = this.loginrepo.create(customerDto.login);
    await this.loginrepo.save(login);

    const customer = this.customerrepo.create({
      info,
      login
    });

    return await this.customerrepo.save(customer);
  }

  async updateCustomer(customerid: string, updateCustomer: Customer): Promise<Customer> {
    try {
      const customer = await this.customerrepo.findOne({ where: { id: customerid }, relations: ['info'] });
      // const customer = await this.customerrepo.findOne({ where: { id: customerid }, relations: ['login', 'info'] });
      // const infoID = await this.customerrepo.find({select:{:true},where:{id:customerid}});
      // console.log(customer.info.id); 
      if (!customer) {
        throw new NotFoundException(`This customer not found`);
      }
      if (updateCustomer.info) {
        await this.inforepo.update(customer.info.id, updateCustomer.info);
      }
      // if (updateCustomer.login) {
      //   await this.loginrepo.update(customer.login.id, updateCustomer.login);
      // }
      const { info, login, ...otherfield } = updateCustomer; //spread by distructuring

      if (Object.keys(otherfield).length > 0) {
        await this.customerrepo.update(customerid, otherfield);
      }

      return this.customerrepo.findOne({ where: { id: customerid }, relations: ['info'] });
      // return this.customerrepo.findOne({ where: { id: customerid }, relations: ['login', 'info'] });
    } catch (error) {
      return error.message
    }
    // Update request 
    //  "info": {
    //     "name": "Harun",
    //     "username": "harun123",
    //     "phoneNumber": "01639788256",
    //     "dateOfBirth": "2002-10-21T18:00:00.000Z",
    //     "profilePhoto": "C:\\Users\\Mohammad\\Downloads\\pizza.jpeg"
    // }
  }

  async getCustomerById(id: string): Promise<Customer> {
    try {
      const cusid = await this.customerrepo.findOneBy({ id: id });

      if (!cusid) {
        throw new NotFoundException(`This customer not found`);
      }
      const relation = this.customerrepo.findOne({ where: { id }, select: { login: { email: true } }, relations: ['login', 'info'] });
      return relation;
    } catch (error) {
      throw new NotFoundException(`This customer not found`);
    }
  }

  async createFeedbackRatings(id: string, feedbackdata: FeedbackDTO): Promise<Feedback> {
    try {
      const customer = await this.customerrepo.findOne({ where: { id } });
      if (!customer) {
        throw new NotFoundException(`This customer not Found`);
      }
      const { message, rating } = feedbackdata;
      const feedback = new Feedback();

      feedback.customer = customer;
      feedback.message = message;
      feedback.rating = rating;
      return await this.feedbackrepo.save(feedback);
    } catch (error) {
      throw new NotFoundException(`${error.message}`)
    }

  }

  // Ticket view
  async getTicketView(): Promise<Ticket[]> {
    try {
      return this.ticketrepo.find();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  /* 
  A bus has 40 seats. 1 to 40 
  Another bus has 40 seats. 1 to 40
  there ticket are different in id 

  */

  // Booked Ticket Service
  async bookedTicket(ticketid: string, customerid: string, bookedData: BookTicketDTO): Promise<TicketBookInfo> {
    try {
      const ticket = await this.ticketrepo.findOne({ where: { id: ticketid } });

      if (ticket) {
        const customer = await this.customerrepo.findOne({ where: { id: customerid } });
        if (customer) {
          const { seatNumberInBus, status } = bookedData;
          const seats = [];
          const bookedticket = new TicketBookInfo();
          // const checkseat = await this.bookticketrepo.findOne({ select:{ticket:{id:true}},where: { seatNumberInBus: seatNumberInBus } ,relations: ['ticket'] });
          const checkseat = await this.bookticketrepo.findOne({where:{ ticket:{id:ticketid }, seatNumberInBus:seatNumberInBus},relations:['ticket'] });
          const price = ticket.price;
          // console.log(checkseat.ticket.id);

          if (checkseat) {
            if (checkseat.ticket.id === ticketid) {
              throw new NotFoundException(`ticket is already booked`);
            }

          }
          if (!checkseat) {
            bookedticket.bookedSeats = 0;

            seats.push(seatNumberInBus); // [5]

            const counting = seats.length; //1

            const bookedseat = bookedticket.bookedSeats + counting; // 0 + 1 = 1

            const totalticketprice = price * bookedseat; // 500 * 1 = 500

            bookedticket.ticket = ticket;
            bookedticket.seatNumberInBus = seatNumberInBus;
            bookedticket.status = status;
            bookedticket.bookedSeats = bookedseat;
            bookedticket.totalPrice = totalticketprice;
            bookedticket.customers = [customer];

            const availableSeat = ticket.availableSeat;

            const totalavailableseat = availableSeat - bookedseat;

            ticket.availableSeat = totalavailableseat;
            if (ticket.availableSeat <= 0) {
              throw new NotFoundException(`All ticket are booked.`);
            }

            await this.bookticketrepo.save(bookedticket);
            await this.customerrepo.save(customer);
            await this.ticketrepo.save(ticket);
            return bookedticket;
          }


        } else {
          throw new NotFoundException(`This customer are not found`);
        }
      } else {
        throw new NotFoundException(`This ticket is not exist`);
      }
    } catch (error) {
      throw new NotFoundException(`${error.message}`);
    }
  }
  // async bookedTicket(ticketid: string, customerid: string, bookedData: BookTicketDTO): Promise<TicketBookInfo> {
  //   try {
  //     const ticket = await this.ticketrepo.findOne({ where: { id: ticketid } });

  //     if (ticket) {
  //       const customer = await this.customerrepo.findOne({ where: { id: customerid } });
  //       if (customer) {
  //         const { seatNumberInBus, status } = bookedData;
  //         const seats = [];
  //         const bookedticket = new TicketBookInfo();
  //         const checkseat = await this.bookticketrepo.findOne({ where: { seatNumberInBus: seatNumberInBus } });
  //         const price = ticket.price;
  //         if (!checkseat) {

  //           bookedticket.bookedSeats = 0;

  //           seats.push(seatNumberInBus); // [5]

  //           const counting = seats.length; //1

  //           const bookedseat = bookedticket.bookedSeats + counting; // 0 + 1 = 1

  //           const totalticketprice = price * bookedseat; // 500 * 1 = 500

  //           bookedticket.ticket = ticket;
  //           bookedticket.seatNumberInBus = seatNumberInBus;
  //           bookedticket.status = status;
  //           bookedticket.bookedSeats = bookedseat;
  //           bookedticket.totalPrice = totalticketprice;
  //           bookedticket.customers = [customer];

  //           const availableSeat = ticket.availableSeat;

  //           const totalavailableseat = availableSeat - bookedseat;

  //           ticket.availableSeat = totalavailableseat;
  //           if (ticket.availableSeat <= 0) {
  //             throw new NotFoundException(`All ticket are booked.`);
  //           }

  //           await this.bookticketrepo.save(bookedticket);
  //           await this.customerrepo.save(customer);
  //           await this.ticketrepo.save(ticket);
  //           return bookedticket;

  //         }
  //         else {
  //           throw new NotFoundException(`This seat is ${seatNumberInBus} already booked`);
  //         }


  //       } else {
  //         throw new NotFoundException(`This customer are not found`);
  //       }
  //     } else {
  //       throw new NotFoundException(`This ticker is not exist`);
  //     }
  //   } catch (error) {
  //     throw new NotFoundException(error.message);
  //   }
  // }

  // History of Ticket
  async historyofticket(customerid: string): Promise<TicketBookInfo[]> {
    try {
      const customer = await this.customerrepo.findOne({ where: { id: customerid } });
      if (customer) {
        const gethistory = await this.bookticketrepo.find({ where: { customers: { id: customerid } }, relations: ['customers', 'ticket'] });
        return gethistory;
      } else {
        throw new NotFoundException(`this customer are not found`);
      }

    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Cancel Booked Ticket
  async cancelBookedTicket(bookedticketid: string): Promise<TicketBookInfo> {
    try {
      const bookedticket = await this.bookticketrepo.findOne({ where: { id: bookedticketid }, relations: ['ticket'] });
      if (bookedticket) {
        const cancelbookedseats = bookedticket.bookedSeats;
        const ticketid = bookedticket.ticket.id;
        const ticket = await this.ticketrepo.findOne({ where: { id: ticketid } });

        const availableSeat = ticket.availableSeat;

        const totalavailableseat = availableSeat + cancelbookedseats;
        ticket.availableSeat = totalavailableseat;

        if (ticket.availableSeat > ticket.totalSeatNumber || ticket.availableSeat <= 0) {
          throw new NotFoundException(`cannot cancel`);
        }
        await this.ticketrepo.save(ticket);
        const deletebookedticket = await this.bookticketrepo.remove(bookedticket);
        return deletebookedticket;
      } else {
        throw new NotFoundException(`Cannot Delete. This Ticket is not found!`);
      }
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Ticket tracking

  async trackBookedTicketById(trackBookedTicketById: string): Promise<TicketBookInfo[]> {
    try {
      const bookedticket = await this.bookticketrepo.find({ where: { id: trackBookedTicketById } });
      return bookedticket;
    } catch (error) {
      return error.message;
    }
  }


  // Get Notification

  async getNotification(customerid: string): Promise<Notification[]> {
    try {
      const customer = await this.customerrepo.findOne({ where: { id: customerid } })
      if (customer) {
        const notification = await this.notificationrepo.find({ where: { customer: { id: customerid } }, relations: ['ticket', 'agent'] });
        return notification;
      } else {
        throw new NotFoundException(`Not Found Customer`);
      }
    } catch (error) {
      return error.message;
    }
  }

  // Report
  async reportCustomer(customerid: string, ticketid: string, reportdata: ReportDTO): Promise<Report> {
    try {
      const customer = await this.customerrepo.findOne({ where: { id: customerid } });
      if (customer) {
        const ticket = await this.ticketrepo.findOne({ where: { id: ticketid } });
        if (ticket) {
          const report = new Report();
          const { message } = reportdata;

          report.customer = customer;
          report.message = message;
          report.ticket = ticket;

          const customerreport = await this.reportrepo.save(report);
          await this.customerrepo.save(customer);
          await this.ticketrepo.save(ticket);

          return customerreport;
        }
      }
    } catch (error) {

    }
  }

  async findOne(email: string, @Session() session): Promise<string | any> {
    try {
      const verifiedemail = await this.loginrepo.findOne({ where: { email } });
      const customer = await this.customerrepo.findOne({ where: { login: { id: verifiedemail.id } } });
      session.customerId = customer.id;
      console.log("customer id is " + session.customerId);
      return verifiedemail;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

}
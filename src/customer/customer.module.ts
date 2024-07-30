import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from 'src/entity/Customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Info } from 'src/entity/Info.entity';
import { Login } from 'src/entity/Login.entity';
import { Feedback } from 'src/entity/Feedback.entity';
import { TicketBookInfo } from 'src/entity/TicketBookInfo.entity';
import { Ticket } from 'src/entity/Ticket.entity';
import { Notification } from 'src/entity/Notification.entity';
import { Report } from 'src/entity/Report.entity';
import { JwtModule } from '@nestjs/jwt';
// import { AuthModule } from './auth/auth.module';
// import { Info } from 'src/entity';
// import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([Customer,Info,Login,Feedback,Ticket,TicketBookInfo,Notification,Report]),
  JwtModule.register({
    global: true,
    secret: '3NP_Backend_Customer',
    signOptions: { expiresIn:'30m'}
  })

],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {}

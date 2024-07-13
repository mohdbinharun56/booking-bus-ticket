import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminManager, Agent, Bus, Customer, CustomerAgent, Feedback, Info, Login, Manager, ManagerAgent, Notification, Report, Ticket, TicketBookInfo } from './entity';
import { Admin } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'ticket',
    entities: [
      Login,
      Info,
      Admin,
      Manager,
      Customer,
      Agent,
      CustomerAgent,
      AdminManager,
      ManagerAgent,
      Bus,
      Ticket,
      Feedback,
      Report,
      Notification,
      TicketBookInfo,
    ],
    autoLoadEntities: true,
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

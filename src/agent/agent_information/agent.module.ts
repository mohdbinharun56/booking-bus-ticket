// src/agent/agent.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../../entity/Agent.entity'; // Adjust the import path as per your structure
import { AgentController, BusController, CustomerAgentController, CustomerController, InfoController, ManagerAgentController, NotificationController, ReportController, TicketBookInfoController, TicketController } from './agent.controller';
import { AgentService, BusService, CustomerAgentService, CustomerService, InfoService, ManagerAgentService, NotificationService, ReportService, TicketBookInfoService, TicketService } from './agent.service';
import{Info} from '../../entity/Info.entity';
import{Login} from '../../entity/Login.entity';
import { Customer } from '../../entity/Customer.entity';
import{ Report} from '../../entity/Report.entity'
import{Ticket} from '../../entity/Ticket.entity'
import {Bus} from '../../entity/Bus.entity'
import{Manager} from '../../entity/Manager.entity'
import{CustomerAgent} from '../../entity/CustomerAgent.entity'

import{ManagerAgent} from '../../entity/ManagerAgent.entity'
import { Notification } from '../../entity/Notification.entity'
import{TicketBookInfo} from '../../entity/TicketBookInfo.entity'

import { Entity } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Agent,Info,Login,Customer,Report,Ticket,Bus,Manager,CustomerAgent,ManagerAgent,Notification,TicketBookInfo])],

  controllers: [AgentController,BusController,CustomerController,CustomerAgentController,InfoController,ManagerAgentController,NotificationController,ReportController,TicketBookInfoController,TicketController],

  providers: [AgentService,BusService,CustomerService,CustomerAgentService,InfoService,ManagerAgentService,NotificationService,ReportService,TicketBookInfoService,TicketService],
})
export class AgentModule {}

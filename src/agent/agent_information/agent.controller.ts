// agent.controller.ts
import { Controller, Get, Param, ParseUUIDPipe, Post, Body,Put,Delete } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './create-agent.dto';
import { UpdateAgentDto } from './create-agent.dto';
import { UpdateLoginDto } from './create-agent.dto';
import{TicketBookInfo} from '../../entity/TicketBookInfo.entity'
import{Notification} from '../../entity/Notification.entity'
import { CreateNotificationDto } from './create-agent.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('all-report-data')
  async getAllData() {
    return this.agentService.findAllData();
  }
  @Get('customers')
  async getAllCustomerData() {
    return this.agentService.getAllCustomerData();
  }
  
  @Get('all-agents')
  async findAllAgents() {
    return this.agentService.findAllAgents();
  }


  @Get('ticket-book-info')
  async getAllTicketBookInfo(): Promise<TicketBookInfo[]> {
    return this.agentService.getAllTicketBookInfo();
  }

  @Get(':id')
  async getAgentDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.agentService.getAgentDetails(id);
  }

  @Post()
  async createAgent(@Body() createAgentDto: CreateAgentDto) {
    return this.agentService.createAgent(createAgentDto);
  }


  //update  and delete info by agent id

  @Put(':id')
  async updateAgent(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentService.updateAgentInfoByAgentId(id, updateAgentDto);
  }

  @Delete(':id')
  async deleteAgent(@Param('id') id: string) {
    return this.agentService.deleteAgentInfoByAgentId(id);
  }


  //update and delete login data by agent id

  @Put(':agentId/login')
  async updateLogin(
    @Param('agentId') agentId: string,
    @Body() updateLoginDto: UpdateLoginDto,
  ) {
    return await this.agentService.updateLoginByAgentId(agentId, updateLoginDto);
  }

 

  @Delete(':agentId/login')
  async deleteLogin(@Param('agentId') agentId: string) {
    await this.agentService.deleteLoginByAgentId(agentId);
    return { message: `Login data for Agent with ID ${agentId} deleted successfully` };
  }



  // notification create and update

  @Post('notification')
  async createNotification(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.agentService.createNotification(createNotificationDto);
  }

  @Put('notification/:id')
  async updateNotification(
    @Param('id') id: string,
    @Body() updateNotificationDto: Partial<CreateNotificationDto>,
  ): Promise<Notification> {
    return this.agentService.updateNotification(id, updateNotificationDto);
  }

 
}



//bus controller

import {  Patch} from '@nestjs/common';
import { BusService } from './agent.service';
import { CreateBusDto } from './create-agent.dto';
import { UpdateBusDto } from './create-agent.dto';
import { Bus } from '../../entity/Bus.entity';

@Controller('bus')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Post()
  create(@Body() createBusDto: CreateBusDto): Promise<Bus> {
    return this.busService.create(createBusDto);
  }

  @Get()
  findAll(): Promise<Bus[]> {
    return this.busService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Bus> {
    return this.busService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto): Promise<Bus> {
    return this.busService.update(id, updateBusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.busService.remove(id);
  }
}
  

// customer controller

// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './agent.service';
import { Customer } from '../../entity/Customer.entity';
import { CreateCustomerDto } from './create-agent.dto';
import { UpdateCustomerDto } from './create-agent.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/Create')
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.customerService.remove(id);
  }
}



//customer agent controller

// customer-agent.controller.ts

import { CustomerAgentService } from './agent.service';
import { CreateCustomerAgentDto } from './create-agent.dto';

@Controller('customer-agent')
export class CustomerAgentController {
  constructor(private readonly customerAgentService: CustomerAgentService) {}

  @Post()
  async create(@Body() createCustomerAgentDto: CreateCustomerAgentDto) {
    return await this.customerAgentService.create(createCustomerAgentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.customerAgentService.findOne(id);
  }

    // New route to get Customer by customerId
    // @Get('customer/:customerId')
    // async findCustomerById(@Param('customerId') customerId: string) {
    //   return await this.customerAgentService.findCustomerById(customerId);
    // }

  // New route to get Info by infoId
  // @Get('info/:infoId')
  // async findInfoById(@Param('infoId') infoId: string) {
  //   return await this.customerAgentService.findInfoById(infoId);
  // }


  @Get('customer/:customerId')
  async findCustomerWithDetails(@Param('customerId') customerId: string) {
    return await this.customerAgentService.findCustomerWithDetails(customerId);
  }

}




// info controller

import {  UsePipes, ValidationPipe } from '@nestjs/common';
import { InfoService } from './agent.service';
import { CreateInfoDto } from './create-agent.dto';
import { Info } from '../../entity/Info.entity';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createInfoDto: CreateInfoDto): Promise<Info> {
    return this.infoService.create(createInfoDto);
  }
  
  

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Info> {
    return this.infoService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateInfoDto: CreateInfoDto): Promise<Info> {
    return this.infoService.update(id, updateInfoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.infoService.remove(id);
  }
}


//manager agent controller

// manager-agent.controller.ts

import { ManagerAgentService } from './agent.service';
import { CreateManagerAgentDto } from './create-agent.dto';

@Controller('manager-agent')
export class ManagerAgentController {
  constructor(private readonly managerAgentService: ManagerAgentService) {}

  @Post()
  async create(@Body() createManagerAgentDto: CreateManagerAgentDto) {
    return await this.managerAgentService.create(createManagerAgentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.managerAgentService.findOne(id);
  }
}


//notification controller 

// notification.controller.ts

import { NotificationService } from './agent.service';


@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  

  @Get('agent/:id')
  async findAgentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationService.findAgentById(id);
  }

  @Post('create')
  async createNotificationEntry(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }
}


//report controller

// report.controller.ts

import { ReportService } from './agent.service';
import { CreateReportDto } from './create-agent.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(@Body() createReportDto: CreateReportDto) {
    return await this.reportService.create(createReportDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reportService.findOne(id);
  }
}

//ticket book  conroller 

// ticket-book-info.controller.ts

import { TicketBookInfoService } from './agent.service';
import { CreateTicketBookInfoDto } from './create-agent.dto';

@Controller('ticket-book-infos')
export class TicketBookInfoController {
  constructor(private readonly ticketBookInfoService: TicketBookInfoService) {}

  @Post()
  async create(@Body() createTicketBookInfoDto: CreateTicketBookInfoDto) {
    return await this.ticketBookInfoService.create(createTicketBookInfoDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ticketBookInfoService.findOne(id);
  }
}

//ticket controller


import { TicketService } from './agent.service';
import { CreateTicketDto, UpdateTicketDto } from './create-agent.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketService.create(createTicketDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ticketService.findOne(id);
  }






  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return await this.ticketService.update(id, updateTicketDto);
  }

 @Delete(':id')
async remove(@Param('id') id: string) {
  await this.ticketService.remove(id);
  return { message: `Ticket with ID ${id} deleted successfully` };
}

}



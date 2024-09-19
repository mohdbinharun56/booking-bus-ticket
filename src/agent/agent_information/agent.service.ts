// agent.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../entity/Agent.entity';
import { Info } from '../../entity/Info.entity';
import { Login } from '../../entity/Login.entity';
import { TicketBookInfo } from '../../entity/TicketBookInfo.entity';
import { CreateAgentDto } from './create-agent.dto';
import { UpdateAgentDto } from './create-agent.dto';
import { UpdateLoginDto } from './create-agent.dto'; // Assuming your DTO is in a dto folder

import { Customer } from '../../entity/Customer.entity';
import { Ticket } from '../../entity/Ticket.entity';
import { Report } from '../../entity/Report.entity';
import { Notification } from '../../entity/Notification.entity';
import { CreateNotificationDto } from './create-agent.dto';


@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Info)
    private infoRepository: Repository<Info>,
    @InjectRepository(Login)
    private loginRepository: Repository<Login>,

    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,

    @InjectRepository(TicketBookInfo)
    private ticketBookInfoRepository: Repository<TicketBookInfo>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    
  ) {}

  async getAgentDetails(id: string) {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['info', 'login'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return {
      info: agent.info,
      login: agent.login,
    };
  }

  async createAgent(createAgentDto: CreateAgentDto) {
    const { infoId, loginId } = createAgentDto;

    const info = await this.infoRepository.findOne({ where: { id: infoId } });
    const login = await this.loginRepository.findOne({ where: { id: loginId } });

    if (!info || !login) {
      throw new NotFoundException('Info or Login entity not found');
    }

    const agent = new Agent();
    agent.info = info;
    agent.login = login;

    return this.agentRepository.save(agent);
  }

  async getDetailsByInfoAndLogin(infoId: string, loginId: string) {
    const info = await this.infoRepository.findOne({ where: { id: infoId } });
    const login = await this.loginRepository.findOne({ where: { id: loginId } });

    if (!info) {
      throw new NotFoundException('Info not found');
    }

    if (!login) {
      throw new NotFoundException('Login not found');
    }

    return {
      info,
      login,
    };
  }

//feth all agents

async findAllAgents() {
  return this.agentRepository.find({ relations: ['info', 'login'] });
}

  //for fetch all the data from customer table

  async getAllCustomerData() {
    return this.customerRepository.find({
      relations: ['info', 'login'],
    });
  }


  //for fetch all report details
  async findAllData() {
    const reports = await this.reportRepository.find({
      relations: ['customer', 'customer.info', 'ticket'],
    });

    const customers = await this.customerRepository.find({
      relations: ['info', 'login'],
    });

    const tickets = await this.ticketRepository.find({
      relations: ['bus'],
    });

    const infos = await this.infoRepository.find();

    return { reports, customers, tickets, infos };
  }


  //update , delete , info by agent id

  async updateAgentInfoByAgentId(agentId: string, updateAgentDto: UpdateAgentDto) {
    const agent = await this.agentRepository.findOne({
      where: { id: agentId },
      relations: ['info'],
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    const updatedInfo = Object.assign(agent.info, updateAgentDto);
    return this.infoRepository.save(updatedInfo);
  }

  async deleteAgentInfoByAgentId(agentId: string) {
    const agent = await this.agentRepository.findOne({
      where: { id: agentId },
      relations: ['info'],
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    await this.infoRepository.remove(agent.info);
    return { message: `Info for Agent with ID ${agentId} deleted successfully` };
  }


  //update , delete,login info by agent id
  async updateLoginByAgentId(agentId: string, updateLoginDto: UpdateLoginDto): Promise<Login> {
    const agent = await this.agentRepository.findOne({ where: { id: agentId }, relations: ['login'] });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    const updatedLogin = Object.assign(agent.login, updateLoginDto);
    return await this.loginRepository.save(updatedLogin);
  }



  async deleteLoginByAgentId(agentId: string): Promise<void> {
    const agent = await this.agentRepository.findOne({ where: { id: agentId }, relations: ['login'] });

    if (!agent || !agent.login) {
      throw new NotFoundException(`Login data for Agent with ID ${agentId} not found`);
    }

    await this.loginRepository.remove(agent.login);
  }


  //check all ticket book info 
  async getAllTicketBookInfo(): Promise<TicketBookInfo[]> {
    return await this.ticketBookInfoRepository.find({ relations: ['ticket', 'customers','customers.info', 'customers.login'] });
  }



  // create notification and update 
  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async updateNotification(id: string, updateNotificationDto: Partial<CreateNotificationDto>): Promise<Notification> {
    const updateResult = await this.notificationRepository.update(id, updateNotificationDto);

    if (updateResult.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.notificationRepository.findOne({ where: { id }, relations: ['agent', 'ticket', 'customer'] });
  }
}





//bus service


// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { Bus } from '../../entity/Bus.entity';
import { CreateBusDto } from './create-agent.dto';
import { UpdateBusDto } from './create-agent.dto';
import { Manager } from '../../entity/Manager.entity';


@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ) {}

  async create(createBusDto: CreateBusDto): Promise<Bus> {
    const manager = await this.managerRepository.findOne({ where: { id: createBusDto.managerId } });
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }
    const bus = this.busRepository.create({
      ...createBusDto,
      manager,
    });
    return this.busRepository.save(bus);
  }

  findAll(): Promise<Bus[]> {
    return this.busRepository.find({ relations: ['manager'] });
  }

  async findOne(id: string): Promise<Bus> {
    const bus = await this.busRepository.findOne({
      where: { id },
      relations: ['manager'],
    });
    if (!bus) {
      throw new NotFoundException('Bus not found');
    }
    return bus;
  }

  async update(id: string, updateBusDto: UpdateBusDto): Promise<Bus> {
    const bus = await this.busRepository.preload({
      id: id,
      ...updateBusDto,
    });
    if (!bus) {
      throw new NotFoundException('Bus not found');
    }
    return this.busRepository.save(bus);
  }

  async remove(id: string): Promise<void> {
    const bus = await this.findOne(id);
    if (!bus) {
      throw new NotFoundException('Bus not found');
    }
    await this.busRepository.remove(bus);
  }
}








//customer services

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Customer } from '../../entity/Customer.entity';
import { CreateCustomerDto } from './create-agent.dto';
import { UpdateCustomerDto } from './create-agent.dto';
// import { Info } from '../../entity/Info.entity';
// import { Login } from '../../entity/Login.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Info)
    private readonly infoRepository: Repository<Info>,
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const info = await this.infoRepository.findOne({ where: { id: createCustomerDto.infoId } });
    const login = await this.loginRepository.findOne({ where: { id: createCustomerDto.loginId } });
    if (!info || !login) {
      throw new NotFoundException('Info or Login not found');
    }
    const customer = this.customerRepository.create({
      info,
      login,
    });
    return this.customerRepository.save(customer);
  }

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ relations: ['info', 'login'] });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['info', 'login'],
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.customerRepository.preload({
      id,
      ...updateCustomerDto,
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    await this.customerRepository.remove(customer);
  }
}


//customer agent service 

import { CreateCustomerAgentDto } from './create-agent.dto';
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { CustomerAgent } from '../../entity/CustomerAgent.entity';
// import { Customer } from '../../entity/customer.entity';
// import { Agent } from '../../entity/agent.entity';
// import { Info } from '../../entity/info.entity';

@Injectable()
export class CustomerAgentService {
  constructor(
    @InjectRepository(CustomerAgent)
    private readonly customerAgentRepository: Repository<CustomerAgent>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(Info)
    private readonly infoRepository: Repository<Info>,
  ) {}

  async create(createCustomerAgentDto: CreateCustomerAgentDto): Promise<CustomerAgent> {
    const { customerId, agentId } = createCustomerAgentDto;

    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const agent = await this.agentRepository.findOne({ where: { id: agentId } });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    const customerAgent = this.customerAgentRepository.create({ customer, agent });
    return await this.customerAgentRepository.save(customerAgent);
  }

  async findOne(id: string): Promise<CustomerAgent> {
    const customerAgent = await this.customerAgentRepository.findOne({
      where: { id },
      relations: ['customer', 'agent'],
    });
    if (!customerAgent) {
      throw new NotFoundException(`CustomerAgent with ID ${id} not found`);
    }
    return customerAgent;
  }




  

// to see info and login information by customer id

  async findCustomerWithDetails(customerId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['info', 'login'], // This will fetch the related Info and Login entities
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return customer;
  }
}



//info service 


// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Info } from '../../entity/Info.entity';
import { CreateInfoDto } from './create-agent.dto';

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(Info)
    private readonly infoRepository: Repository<Info>,
  ) {}

  async create(createInfoDto: CreateInfoDto): Promise<Info> {
    const info = this.infoRepository.create(createInfoDto);
    return await this.infoRepository.save(info);
  }

  async findOne(id: string): Promise<Info> {
    const info = await this.infoRepository.findOne({ where: { id } });
    if (!info) {
      throw new NotFoundException('Info not found');
    }
    return info;
  }

  async update(id: string, updateInfoDto: CreateInfoDto): Promise<Info> {
    const info = await this.findOne(id);
    Object.assign(info, updateInfoDto);
    return await this.infoRepository.save(info);
  }

  async remove(id: string): Promise<void> {
    const info = await this.findOne(id);
    await this.infoRepository.remove(info);
  }
}


//manager agent service 

// manager-agent.service.ts

import { ManagerAgent } from '../../entity/ManagerAgent.entity';
import { CreateManagerAgentDto } from './create-agent.dto';


@Injectable()
export class ManagerAgentService {
  constructor(
    @InjectRepository(ManagerAgent)
    private readonly managerAgentRepository: Repository<ManagerAgent>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async create(createManagerAgentDto: CreateManagerAgentDto): Promise<ManagerAgent> {
    const { managerId, agentId } = createManagerAgentDto;

    const manager = await this.managerRepository.findOne({ where: { id: managerId } });
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found`);
    }

    const agent = await this.agentRepository.findOne({ where: { id: agentId } });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    const managerAgent = this.managerAgentRepository.create({ manager, agent });
    return await this.managerAgentRepository.save(managerAgent);
  }

  async findOne(id: string): Promise<ManagerAgent> {
    const managerAgent = await this.managerAgentRepository.findOne({ where: { id }, relations: ['manager', 'agent'] });
    if (!managerAgent) {
      throw new NotFoundException(`ManagerAgent with ID ${id} not found`);
    }
    return managerAgent;
  }
}



//notification service 

// notification.service.ts

// import { Notification } from '../../entity/Notification.entity';

// import { CreateNotificationDto } from './create-agent.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>, @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>, @InjectRepository(Customer) private customerRepository: Repository<Customer>, ) {}

    
  async createNotification(createNotificationDto: CreateNotificationDto) {
    const { message, agentId, ticketId, customerId } = createNotificationDto;

    const agent = await this.agentRepository.findOne({ where: { id: agentId } });
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });

    if (!agent || !ticket || !customer) {
      throw new NotFoundException('Agent, Ticket or Customer not found');
    }

    const notification = new Notification();
    notification.message = message;
    notification.agent = agent;
    notification.ticket = ticket;
    notification.customer = customer;

    return this.notificationRepository.save(notification);
  }

  async findAgentById(id: string) {
    const agent = await this.agentRepository.findOne({ where: { id } });

    if (!agent) {
      throw new NotFoundException('Agent ID not found');
    }

    return { agentId: agent.id };
  }
}



//report service 

// report.service.ts

import { CreateReportDto } from './create-agent.dto';


@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const { customerId, ticketId, ...rest } = createReportDto;

    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    const report = this.reportRepository.create({ customer, ticket, ...rest });
    return await this.reportRepository.save(report);
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id }, relations: ['customer', 'ticket'] });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }
}


//ticket book service 

// import { TicketBookInfo } from '../../entity/TicketBookInfo.entity';
import { CreateTicketBookInfoDto } from './create-agent.dto';


@Injectable()
export class TicketBookInfoService {
  constructor(
    @InjectRepository(TicketBookInfo)
    private readonly ticketBookInfoRepository: Repository<TicketBookInfo>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(createTicketBookInfoDto: CreateTicketBookInfoDto): Promise<TicketBookInfo> {
    const { ticketId, ...rest } = createTicketBookInfoDto;
    
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    const ticketBookInfo = this.ticketBookInfoRepository.create({ ...rest, ticket });
    return await this.ticketBookInfoRepository.save(ticketBookInfo);
  }

  async findOne(id: string): Promise<TicketBookInfo> {
    const ticketBookInfo = await this.ticketBookInfoRepository.findOne({ where: { id }, relations: ['ticket'] });
    if (!ticketBookInfo) {
      throw new NotFoundException(`TicketBookInfo with ID ${id} not found`);
    }
    return ticketBookInfo;
  }
}




//ticket service 
 
import { CreateTicketDto, UpdateTicketDto } from './create-agent.dto'; // Assuming you have UpdateTicketDto
import { FindOneOptions } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketRepository.create(createTicketDto);
    return await this.ticketRepository.save(ticket);
  }

  async findOne(id: string): Promise<Ticket> {
    const options: FindOneOptions<Ticket> = {
      where: { id }, 
    };

    const ticket = await this.ticketRepository.findOne(options);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    const updatedTicket = this.ticketRepository.merge(ticket, updateTicketDto);
    return await this.ticketRepository.save(updatedTicket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketRepository.remove(ticket);
  }
}

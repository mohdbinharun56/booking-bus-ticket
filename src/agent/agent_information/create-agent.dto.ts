// create-agent.dto.ts
import { IsUUID, IsNotEmpty } from 'class-validator';
import { IsOptional, IsString, IsEmail } from 'class-validator';


export class CreateAgentDto {
  @IsUUID()
  @IsNotEmpty()
  infoId: string;

  @IsUUID()
  @IsNotEmpty()
  loginId: string;
}

export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // Add other fields that you want to be able to update
}




export class UpdateLoginDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  passHash?: string;

  // Add other fields that you want to be able to update
}





// bus dto 


import {  IsNumber} from 'class-validator';

export class CreateBusDto {
  @IsString()
  readonly busNumber: string;

  @IsNumber()
  readonly totalSeat: number;

  @IsString()
  readonly busType: string;

  @IsUUID()
  readonly managerId: string;
}



import { PartialType } from '@nestjs/mapped-types';
// import { CreateBusDto } from './create-bus.dto';

export class UpdateBusDto extends PartialType(CreateBusDto) {}


//customer dto


// import { IsUUID } from 'class-validator';

export class CreateCustomerDto {
  @IsUUID()
  readonly infoId: string;

  @IsUUID()
  readonly loginId: string;
}


// import { PartialType } from '@nestjs/swagger';
// import { CreateCustomerDto } from './customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}








// customer-agent.dto.ts


// import { IsUUID } from 'class-validator';

export class CreateCustomerAgentDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  agentId: string;
}


//info dto


import {  IsDateString, Matches, Length } from 'class-validator';

export class CreateInfoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11, { message: 'Phone number must be exactly 11 digits long' })
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only numeric characters' })
  phoneNumber: string;

  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, { message: 'Date of birth must be in the format dd-MM-yyyy' })
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  profilePhoto: string;
}

// manager agent dto 

// create-manager-agent.dto.ts


export class CreateManagerAgentDto {
  @IsUUID()
  managerId: string;

  @IsUUID()
  agentId: string;
}




//notification dto 


// create-notification.dto.ts


export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUUID()
  @IsNotEmpty()
  agentId: string;

  @IsUUID()
  @IsNotEmpty()
  ticketId: string;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;
}

//report dto 

// create-report.dto.ts


export class CreateReportDto {
  @IsString()
  message: string;

  @IsUUID()
  customerId: string;

  @IsUUID()
  ticketId: string;
}


//ticket book dto 
// create-ticket-book-info.dto.ts


export class CreateTicketBookInfoDto {
  @IsNumber()
  seatNumberInBus: number;

  @IsString()
  status: string;

  @IsNumber()
  totalPrice: number;

  @IsNumber()
  bookedSeats: number;

  @IsUUID()
  @IsNotEmpty()
  ticketId: string;
}


//ticket dto file

import {  IsDate } from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  totalSeatNumber: number;

  @IsNumber()
  bookedSeats: number;

  @IsNumber()
  price: number;

  @IsDate()
  dateTime: Date;

  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsString()
  busTime: string;

  @IsNumber()
  availableSeat: number;

  @IsString()
  busId: string;  // Assuming bus is linked by its ID
}

export class UpdateTicketDto {
  @IsNumber()
  totalSeatNumber?: number;

  @IsNumber()
  bookedSeats?: number;

  @IsNumber()
  price?: number;

  @IsDate()
  dateTime?: Date;

  @IsString()
  from?: string;

  @IsString()
  to?: string;

  @IsString()
  busTime?: string;

  @IsNumber()
  availableSeat?: number;

  @IsString()
  busId?: string;  // Assuming bus is linked by its ID
}

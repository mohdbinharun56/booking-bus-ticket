import { IsString, IsDateString, IsNotEmpty, MaxLength, IsNumber, Matches, IsMilitaryTime } from 'class-validator';

export class InfoDTo {
    // @IsUUID()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsDateString()
    @IsNotEmpty()
    dateOfBirth: Date;

    // @IsString()
    // @IsNotEmpty()
    profilePhoto: string;
}

export class CustoomerDTo {

    // @IsUUID()
    id: string;
    
    // @IsUUID()
    infoId: string;

    @IsNotEmpty()
    login: {
        email: string;
        passHash: string;
        roleUser: string;
    };
}


export class FeedbackDTO {
    @IsNotEmpty()
    @MaxLength(50)
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsNumber()
    rating: number;

    // customerid: string;
}


export class BookTicketDTO {

    @IsNotEmpty()
    seatNumberInBus: number;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(booked|pending)$/)
    status: string;

}

export class ReportDTO{
    @IsString()
    // @Length(50)
    message:string;
}
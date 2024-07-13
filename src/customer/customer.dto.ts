import { IsString, IsDateString, IsNotEmpty} from 'class-validator';

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

    @IsString()
    @IsNotEmpty()
    profilePhoto: string;
}


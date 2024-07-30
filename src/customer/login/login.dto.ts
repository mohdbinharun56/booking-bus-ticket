import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
export class LoginDTO{
    id:string

    @IsEmail()
    @IsNotEmpty({message: 'Email must be required'})
    email:string

    @IsString()
    @IsNotEmpty({message: 'Password must be required'})
    passHash:string

    @IsString()
    @IsNotEmpty({message: 'User role must be required'})
    roleUser:string
}
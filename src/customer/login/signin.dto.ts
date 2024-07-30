import { IsNotEmpty, IsString } from "class-validator"

export class SignInDTO{
    
    @IsNotEmpty({message:"Email is required!"})
    @IsString({message:"email field must be string!"})
    email:string

    @IsNotEmpty({message:"Password is required!"})
    @IsString({message:"Password field must be string!"})
    password:string
}
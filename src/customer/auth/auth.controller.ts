import { Controller, HttpCode, HttpStatus, Post, Body, UnauthorizedException, Session } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDTO } from "../login/signin.dto";
import session from "express-session";
// import session from "express-session";

@Controller('auth')
export class AuthController{
    constructor(private readonly authservice:AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() signindto:SignInDTO,@Session() session){
        try{
            const signin = this.authservice.sigin(signindto.email,signindto.password,session);
            return signin;
        }catch(error){
            throw new UnauthorizedException(error.message);
        }
    }
}
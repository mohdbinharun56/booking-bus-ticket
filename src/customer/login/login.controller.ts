import { Body, Controller, Post, UsePipes, ValidationPipe, Res, HttpStatus, Session } from "@nestjs/common";
import { LoginService } from "./login.service";
import { LoginDTO } from "./login.dto";
import { Login } from "src/entity/Login.entity";
import { SignInDTO } from "./signin.dto";
import { Customer } from "src/entity";
// import session from "express-session";
@Controller('login')

export class LoginController {
    constructor(private readonly loginservice: LoginService) { }

    // register
    @Post('/registration')
    @UsePipes(new ValidationPipe())
    async registerCustomer(@Body() myobj: LoginDTO, @Res() res: any): Promise<Login> {
        try {
            const createLogin = await this.loginservice.registerCustomer(myobj);
            return res.status(HttpStatus.CREATED).json({
                message: 'Register Successful',
                myobj: createLogin,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Register Failed',
                error: error.message,
            });
        }
    }

    @Post('signin')
    async signin(@Body() signindata:SignInDTO, @Res() res: any,@Session() session): Promise<Customer> {
        try {
            const verify = await this.loginservice.signin(signindata);
            session.cusid = verify;
            // console.log(session.cusid);
            return res.status(HttpStatus.ACCEPTED).json({
                message: `verified user`,
                verify
            });
        }
        catch (error){
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: `user not verified. ${error.message}`,
            });
        }

    }
    // password Update

}
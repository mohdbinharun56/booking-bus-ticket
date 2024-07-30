import { Module } from "@nestjs/common";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Login } from "src/entity/Login.entity";
import { Customer } from "src/entity";
import { JwtModule } from "@nestjs/jwt";
@Module({
    imports: [JwtModule,TypeOrmModule.forFeature([Login,Customer])],
    controllers: [LoginController],
    providers: [LoginService],
})
export class LoginModule{}
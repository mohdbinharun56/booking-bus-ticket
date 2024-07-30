import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CustomerModule } from "../customer.module";
import { AuthController } from "./auth.controller";
import { JwtConstants } from "./constants";
import { JwtModule } from "@nestjs/jwt";
@Module({
    imports: [CustomerModule,JwtModule.register({
        global: true,
        secret: JwtConstants.secret,
        signOptions: { expiresIn:'20m'}

    })],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})

export class AuthModule{}
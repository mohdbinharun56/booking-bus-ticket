import { Injectable, Session, UnauthorizedException } from "@nestjs/common";
import { CustomerService } from "../customer.service";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Login } from "src/entity";
// import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import session from "express-session";

@Injectable()
export class AuthService {
    constructor(private readonly customerservice: CustomerService,
        private readonly jwtservice: JwtService,
    ) { }

    async sigin(email: string, password: string,@Session() session): Promise<any> {
        try {
            const user = await this.customerservice.findOne(email,session);
            if (user) {
                const isMatch = await bcrypt.compare(password, user.passHash);
                if (isMatch) {
                    const payload = { sub: user.id };
                    return {
                        access_tocken: await this.jwtservice.signAsync(payload),
                    }
                } else {
                    throw new UnauthorizedException(`password not match`);
                }
            } else {
                throw new UnauthorizedException(`user not found`);
            }
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }

    }
}
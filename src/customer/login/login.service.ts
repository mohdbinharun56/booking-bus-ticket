import { Injectable, Session, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Login } from "src/entity/Login.entity";
import { Repository } from "typeorm";
import { LoginDTO } from "./login.dto";
import * as bcrypt from "bcrypt";
import { Customer } from "src/entity";
import { SignInDTO } from "./signin.dto";


@Injectable()
export class LoginService {
    constructor(@InjectRepository(Login) private readonly loginrepo: Repository<Login>,
        @InjectRepository(Customer) private readonly customerrepo: Repository<Customer>,
    ) { }

    registerCustomer(myobj: LoginDTO): Promise<Login> {
        const { email, passHash, roleUser } = myobj;
        const newlogin = new Login();
        newlogin.email = email;
        newlogin.passHash = passHash;
        newlogin.roleUser = roleUser;

        return this.loginrepo.save(newlogin);
    }

    async signin(signindata:SignInDTO): Promise<Customer> {
        try {
            const {email,password} = signindata;
            const verifymail = await this.loginrepo.findOneBy({ email });

            const customer = await this.customerrepo.findOne({ where: { login: { id: verifymail.id } } });
            if (verifymail) {
                const matchpassword = await bcrypt.compare(password, verifymail.passHash);
                if (matchpassword) {
                    return customer;
                } else {
                    throw new UnauthorizedException();
                }
            } else {
                throw new UnauthorizedException();
            }
        }catch(error){
            throw new UnauthorizedException(error.message);
        }
    }
}
import { Injectable, NotFoundException, Session, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Info } from "src/entity/Info.entity";
import { Repository } from "typeorm";
import { InfoDTo } from "../customer.dto";
// import session from "express-session";

@Injectable()
export class InfoService {
    constructor(@InjectRepository(Info) private readonly infoRepo: Repository<Info>) { }

    async createInfo(infodto: InfoDTo): Promise<Info> {
        try {
            return await this.infoRepo.save(infodto);

            // infodto.profilePhoto = file.filename;

            // const { name, username, phoneNumber, dateOfBirth } = infodto;
            // const newInfo = new Info();
            // newInfo.name = name;
            // newInfo.username = username;
            // newInfo.phoneNumber = phoneNumber;
            // newInfo.dateOfBirth = dateOfBirth;
            // newInfo.profilePhoto = file.filename;

            // return await this.infoRepo.save(newInfo);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    async getInfoById(infoid: string): Promise<Info> {
        try {
            const info = await this.infoRepo.findOneBy({ id: infoid });
            if (!info) {
                throw new NotFoundException(`Info with id ${infoid} not found`);
            }
            return info;

        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
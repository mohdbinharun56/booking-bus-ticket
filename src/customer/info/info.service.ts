import { Injectable,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Info } from "src/entity/Info.entity";
import { Repository } from "typeorm";
import { InfoDTo } from "../customer.dto";

@Injectable()
export class InfoService{
    constructor(@InjectRepository(Info) private readonly infoRepo: Repository<Info>){}

    async createInfo(infodto:InfoDTo): Promise<Info>{
        const {name,username,phoneNumber,dateOfBirth,profilePhoto} = infodto;
        const newInfo = new Info();
        newInfo.name = name;
        newInfo.username = username;
        newInfo.phoneNumber = phoneNumber;
        newInfo.dateOfBirth = dateOfBirth;
        newInfo.profilePhoto = profilePhoto;

        return await this.infoRepo.save(newInfo);
    }

}
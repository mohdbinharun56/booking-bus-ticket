import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Info } from "src/entity/Info.entity";
import { InfoController } from "./info.controller";
import { InfoService } from "./info.service";

@Module({
    imports: [TypeOrmModule.forFeature([Info])],
    controllers: [InfoController],
    providers: [InfoService]
})
export class InfoModule{}
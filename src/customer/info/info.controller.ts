import { Body, Controller, HttpStatus, Post, Res, Get,Param, UsePipes, ValidationPipe} from "@nestjs/common";
import { InfoService } from "./info.service";
import { Info } from "src/entity/Info.entity";
import { InfoDTo } from "../customer.dto";

@Controller('info')
export class InfoController{
    constructor(private readonly infoService:InfoService){}

    @Post('createInfo')
    @UsePipes(new ValidationPipe())
    async createInfo(@Body() info:InfoDTo,@Res() res): Promise<Info>{
        try{
            const createdInfo = await this.infoService.createInfo(info);
            return res.status(HttpStatus.CREATED).json({
            message: 'Info ceated successfully',
            info: createdInfo,
        });
        }catch(error){
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Failed to create info',
                error: error.message,
        });
        }
    }

}
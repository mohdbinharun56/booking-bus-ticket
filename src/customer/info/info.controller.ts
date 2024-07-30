import { Body, Controller, HttpStatus, Post, Res, Get, Param, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Session } from "@nestjs/common";
import { InfoService } from "./info.service";
import { InfoDTo } from "../customer.dto";
import { Info } from "src/entity/Info.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";
// import session from "express-session";

@Controller('info')
export class InfoController {
    constructor(private readonly infoService: InfoService) { }

    // @Post('createInfo')
    // @UsePipes(new ValidationPipe())
    // async createInfo(@Body() info: InfoDTo, @Res() res: any): Promise<Info> {
    //     try {
    //         const createdInfo = await this.infoService.createInfo(info);
    //         return res.status(HttpStatus.CREATED).json({
    //             message: 'Info ceated successfully',
    //             info: createdInfo,
    //         });
    //     } catch (error) {
    //         return res.status(HttpStatus.BAD_REQUEST).json({
    //             message: 'Failed to create info',
    //             error: error.message,
    //         });
    //     }
    // }


    @Get(':infoid')
    async getInfoById(@Param('infoid') infoid: string): Promise<Info> {
        return this.infoService.getInfoById(infoid);
    }


    // upload profile
    @Post('createInfo')
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('file',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|png|webp|jpeg)$/)) {
                    cb(null, true);
                } else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 30000 },
            storage: diskStorage({
                destination: './upload',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname);
                },
            })

        }))
    async createInfo(@Body() info: InfoDTo, @UploadedFile() file: Express.Multer.File, @Res() res: any,@Session() session): Promise<Info> {
        try {
            info.profilePhoto =file.filename;
            const createdInfo = await this.infoService.createInfo(info);
            session.infoid = createdInfo.id;
            console.log(session.infoid);
            return res.status(HttpStatus.CREATED).json({
                message: 'Info ceated successfully',
                info: createdInfo,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Failed to create info',
                error: error.message,
            });
        }
    }
    @Get('/getimage/:name')
    getImages(@Param('name') name: string, @Res() res) {
        res.sendFile(name, { root: './upload' })
    }
}
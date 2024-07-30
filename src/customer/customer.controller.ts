import { Body, Controller, Post, UsePipes, ValidationPipe, Get, Param, Res, HttpStatus, Put, Delete, Catch, UseGuards, Session, UnauthorizedException } from '@nestjs/common';
import { Customer } from 'src/entity/Customer.entity';
import { CustomerService } from './customer.service';
import { BookTicketDTO, CustoomerDTo, FeedbackDTO, ReportDTO } from './customer.dto';
import { Feedback, Notification, Report, Ticket, TicketBookInfo } from 'src/entity';
import { AuthGuard } from './auth/auth.guards';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerservice: CustomerService) { }

    //1 register
    // @Post('addcustomer/:infoid')
    @Post('addcustomer/')
    @UsePipes(new ValidationPipe())
    async createCustomer(@Body() myobj: CustoomerDTo, @Session() session): Promise<Customer> {
        const infoid = session.infoid;
        return this.customerservice.createCustomer(infoid, myobj);
    }
    // async createCustomer(@Param('infoid') infoid: string, @Body() myobj: CustoomerDTo): Promise<Customer> {

    //     return this.customerservice.createCustomer(infoid, myobj);
    // }

    //2 get customer by id
    @UseGuards(AuthGuard)
    @Get('getcustomerById')
    getCustomerById(@Session() session): object {
        const customerid = session.customerId;
        return this.customerservice.getCustomerById(customerid);
    }
    // @Get('getcustomerById/:customerid')
    // getCustomerById(@Param('customerid') customerid: string): object {
    //     return this.customerservice.getCustomerById(customerid);
    // }

    //3 update customer information
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @Put('updatecustomer')
    updateCustomer(@Session() session, @Body() updatecustomer: Customer): Promise<Customer> {
        const customerid = session.customerId;
        return this.customerservice.updateCustomer(customerid, updatecustomer);
    }
    // @Post('updatecustomer/:customerid')
    // updateCustomer(@Param('customerid') customerid: string, @Body() updatecustomer: Customer): Promise<Customer> {
    //     return this.customerservice.updateCustomer(customerid, updatecustomer);
    // }

    //4 Feedback & Ratings
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('createfeedback')
    createFeedbackRatings(@Session() session, @Body() feedbackdata: FeedbackDTO): Promise<Feedback> {
        const customerid = session.customerId;
        return this.customerservice.createFeedbackRatings(customerid, feedbackdata);
    }
    // @Post('createfeedback/:customerid')
    // createFeedbackRatings(@Param('customerid') customerid: string, @Body() feedbackdata: FeedbackDTO): Promise<Feedback> {
    //     return this.customerservice.createFeedbackRatings(customerid, feedbackdata);
    // }

    //5 Ticket view
    @UseGuards(AuthGuard)
    @Get('viewticket')
    getTicketView(): Promise<Ticket[]> {
        return this.customerservice.getTicketView()
    }

    //6 Booked Ticket API
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('book/:ticketid')
    bookedTicket(
        @Param('ticketid') ticketid: string,
        @Session() session,
        @Body() bookedData: BookTicketDTO): Promise<TicketBookInfo> {
        const customerid = session.customerId;
        // console.log(customerid);
        return this.customerservice.bookedTicket(ticketid, customerid, bookedData);
    }
    // @Post('book/:ticketid/customer/:customerid')
    // bookedTicket(
    //     @Param('ticketid') ticketid: string,
    //     @Param('customerid') customerid: string,
    //     @Body() bookedData: BookTicketDTO): Promise<TicketBookInfo> {
    //     return this.customerservice.bookedTicket(ticketid, customerid, bookedData);
    // }

    //7 Ticket History
    @UseGuards(AuthGuard)
    @Get('historyofticket')
    historyofticket(@Session() session): Promise<TicketBookInfo[]> {
        const customerid = session.customerId;
        return this.customerservice.historyofticket(customerid);
    }
    // @Get('historyofticket/:customerid')
    // historyofticket(@Param('customerid') customerid: string): Promise<TicketBookInfo[]> {
    //     return this.customerservice.historyofticket(customerid);
    // }

    //8 Ticket Cancel
    @UseGuards(AuthGuard)
    @Delete('cancelticket/:bookedticketid')
    async cancelBookedTicket(@Param('bookedticketid') bookedticketid: string, @Res() res: any): Promise<TicketBookInfo> {
        try {
            const deleteticket = await this.customerservice.cancelBookedTicket(bookedticketid);
            return res.status(HttpStatus.ACCEPTED).json({
                message: `${bookedticketid} is cancel successfully`,
                deleteticket
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: `${bookedticketid} is not canceled. Because ${error.message}`,

            });
        }

    }

    //9 Ticket Tracking/ specific booked ticket
    @UseGuards(AuthGuard)
    @Get('tracking/:trackingbookedticketid')
    trackBookedTicketById(@Param('trackingbookedticketid') trackingbookedticketid: string): Promise<TicketBookInfo[]> {
        return this.customerservice.trackBookedTicketById(trackingbookedticketid);
    }

    //10 Notification check
    @UseGuards(AuthGuard)
    @Get('notification')
    getNotification(@Session() session): Promise<Notification[]> {
        try {
            const customerid = session.customerId;
            const notification = this.customerservice.getNotification(customerid);
            return notification;
        } catch (error) {
            return error.message;
        }
    }
    // @Get('notification/:customerid')
    // getNotification(@Param('customerid') customerid: string): Promise<Notification[]> {
    //     try {
    //         const notification = this.customerservice.getNotification(customerid);
    //         return notification;
    //     } catch (error) {
    //         return error.message;
    //     }
    // }

    //11 customer report
    @UseGuards(AuthGuard)
    @Post('report/ticket/:ticketid')
    async reportCustomer(@Session() session,
        @Param('ticketid') ticketid: string, @Body() reportdata: ReportDTO,
        @Res() res: any): Promise<Report> {
        try {
            const customerid = session.customerId;
            const createreport = await this.customerservice.reportCustomer(customerid, ticketid, reportdata);
            return res.status(HttpStatus.CREATED).json({
                message: `Report subimted successfully`,
                createreport,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: `Report is not submited`,
                error: error.message,
            });
        }
    }
    // @Post('report/:customerid/ticket/:ticketid')
    // async reportCustomer(@Param('customerid') customerid: string,
    //     @Param('ticketid') ticketid: string,@Body() reportdata: ReportDTO,
    //     @Res() res:any): Promise<Report> {
    //     try {
    //         const createreport = await this.customerservice.reportCustomer(customerid,ticketid,reportdata);
    //         return res.status(HttpStatus.CREATED).json({
    //             message: `Report subimted successfully`,
    //             createreport,
    //         });
    //     } catch (error) {
    //         return res.status(HttpStatus.BAD_REQUEST).json({
    //             message: `Report is not submited`,
    //             error: error.message,
    //         });
    //     }
    // }

    // Optional to get total number of ticket and price 
    // @Get('') 


    //12 logout destroy session
    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Session() session) {
        try {
            session.destroy(session.customerId,session.infoid);
        }
        catch(error){
            throw new UnauthorizedException(error.message);
        }
    }


}
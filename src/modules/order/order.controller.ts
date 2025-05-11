import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { OrganizationService } from '../organization/organization.service';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerTypes, OrderTypes, paymentMethodTypes } from 'src/enums';
import { OrderService } from './order.service';

@Controller('/orders')
export class OrderController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly orderService: OrderService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('/all')
  @UseGuards(AuthGuard)
  async getOrders(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
  ) {
    return await this.orderService.getOrders({
      page,
      limit,
      slug,
    });
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  async createOrder(
    @Request() req,
    @Body()
    {
      slug,
      type,
      paymentMethod,
      paymentAmount,
      blingProducts,
      services,
      members,
      commissionPercent,
      memberCommissions,
      customer,
    }: {
      slug: string;
      type: OrderTypes;
      paymentMethod: paymentMethodTypes;
      paymentAmount?: number;
      blingProducts: {
        id: string;
        nome: string;
        preco: number;
        precoCusto: number;
        quantity: number;
      }[];
      services: {
        id: string;
        title: string;
        price: number;
      }[];
      members: { id: string; name: string }[];
      commissionPercent: number;
      memberCommissions: { memberId: string; value: number }[];
      customer: {
        id: string;
        customerType: CustomerTypes;
        name: string;
        mainNumber: string;
        contactNumber: string;
        address: string;
      };
    },
  ) {
    const user = req.user;

    return this.orderService.createOrder({
      slug,
      type,
      paymentMethod,
      paymentAmount,
      blingProducts,
      services,
      members,
      commissionPercent,
      memberCommissions,
      customer,
      ownerId: user.id,
    });
  }
}

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

  @Post('/update-visibility')
  @UseGuards(AuthGuard)
  async updateOrderVisibility(
    @Body()
    { orderId, showOrder }: { orderId: string; showOrder: boolean },
  ) {
    return await this.orderService.updateOrderVisibility({
      orderId,
      showOrder,
    });
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  async getOrders(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
    @Query('role') role: string,
    @Query('memberId') memberId: string,
  ) {
    return await this.orderService.getOrders({
      page,
      limit,
      slug,
      role,
      memberId,
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
      service,
      note,
      members,
      customer,
      showOrder,
      date,
    }: {
      slug: string;
      type: OrderTypes;
      paymentMethod?: paymentMethodTypes;
      paymentAmount?: number;
      blingProducts?: {
        id: string;
        nome: string;
        preco: number;
        precoCusto: number;
        quantity: number;
      }[];
      service: string;
      members?: { id: string; name: string }[];
      customer: {
        id: string;
        customerType: CustomerTypes;
        name: string;
        mainNumber: string;
        contactNumber: string;
        address: string;
      };
      showOrder: boolean;
      date: Date;
      note?: string;
    },
  ) {
    const user = req.user;

    return this.orderService.createOrder({
      slug,
      type,
      paymentMethod,
      paymentAmount,
      blingProducts,
      service,
      note,
      members,
      customer,
      showOrder,
      date,
      ownerId: user.id,
    });
  }

  @Post('/update')
  @UseGuards(AuthGuard)
  async updateOrder(
    @Request() req,
    @Body()
    {
      orderId,
      slug,
      orderType,
      paymentMethod,
      paymentAmount,
      blingProducts,
      members,
      customer,
      showOrder,
      service,
      date,
      note,
    }: {
      orderId: string;
      slug: string;
      orderType: OrderTypes;
      paymentMethod: paymentMethodTypes;
      paymentAmount?: number;
      blingProducts: {
        id: string;
        nome: string;
        preco: number;
        precoCusto: number;
        quantity: number;
      }[];
      members: { id: string; name: string }[];
      customer: {
        id: string;
        customerType: CustomerTypes;
        name: string;
        mainNumber: string;
        contactNumber: string;
        address: string;
      };
      showOrder: boolean;
      service: string;
      date: Date;
      note: string;
    },
  ) {
    const user = req.user;

    return this.orderService.updateOrder({
      orderId,
      slug,
      orderType,
      paymentMethod,
      paymentAmount,
      blingProducts,
      members,
      customer,
      ownerId: user.id,
      showOrder,
      service,
      date,
      note,
    });
  }
}

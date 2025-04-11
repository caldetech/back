import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Request,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ComissionService } from './comission.service';

@Controller('/comissions')
export class ComissionController {
  constructor(private readonly comissionService: ComissionService) {}

  @Get('/by-order-id')
  @UseGuards(AuthGuard)
  findByOrderId(@Param('orderId') orderId: string) {
    return this.comissionService.findByOrderId(orderId);
  }

  @Get('/all-me')
  @UseGuards(AuthGuard)
  async findByUserId(@Request() req) {
    const userId = req.user.id;

    return this.comissionService.findByUserId(userId);
  }
}

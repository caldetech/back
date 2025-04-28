import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Request,
  Body,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Commissionservice } from './commission.service';

@Controller('/commissions')
export class CommissionController {
  constructor(private readonly commissionservice: Commissionservice) {}

  @Get('/all')
  @UseGuards(AuthGuard)
  async getCommissions(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
  ) {
    return await this.commissionservice.getCommissions({
      page,
      limit,
      slug,
    });
  }
}

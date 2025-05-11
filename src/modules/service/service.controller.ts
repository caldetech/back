import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('/search')
  @UseGuards(AuthGuard)
  async searchService(
    @Body() { slug, query }: { slug: string; query: string },
  ) {
    return this.serviceService.searchService({ query, slug });
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  async createService(
    @Body()
    {
      slug,
      title,
      description,
      price,
    }: {
      slug: string;
      title: string;
      description?: string;
      price: number;
    },
  ) {
    return await this.serviceService.createService({
      slug,
      title,
      description,
      price,
    });
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  async getServices(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('slug') slug: string,
  ) {
    return await this.serviceService.getServices({
      page,
      limit,
      slug,
    });
  }
}

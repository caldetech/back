import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async createProducts(@Body() { slug, blingProducts }) {
    return await this.productService.createProducts({ slug, blingProducts });
  }
}

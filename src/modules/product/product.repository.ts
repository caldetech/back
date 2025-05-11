import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProducts({ organizationId, blingProducts }) {
    try {
      return await this.prisma.product.createManyAndReturn({
        data: blingProducts.map((product) => {
          return {
            blingId: product.id,
            name: product.nome,
            price: product.preco,
            costPrice: product.precoCusto,
            organizationId,
          };
        }),
        skipDuplicates: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerTypes, OrderTypes, paymentMethodTypes } from 'src/enums';
import { OrderRepository } from './order.repository';
import { OrganizationService } from '../organization/organization.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly organizationService: OrganizationService,
    private readonly productService: ProductService,
  ) {}

  async getOrders({
    page,
    limit,
    slug,
  }: {
    page: number;
    limit: number;
    slug: string;
  }) {
    const numericPage = Number(page);
    const numericLimit = Number(limit);

    return await this.orderRepository.getOrders({
      page: numericPage,
      limit: numericLimit,
      slug,
    });
  }

  async createOrder({
    slug,
    type,
    paymentMethod,
    paymentAmount,
    blingProducts,
    members,
    commissionPercent,
    memberCommissions,
    customer,
    ownerId,
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
    ownerId: string;
  }) {
    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (!organization) {
      throw new BadRequestException('Organização não encontrada');
    }

    const storedProducts = await this.productService.createProducts({
      slug,
      blingProducts,
    });

    if (!storedProducts) {
      throw new BadRequestException('Erro ao armazenar produtos do Bling');
    }

    return this.orderRepository.createOrder({
      slug,
      type,
      paymentMethod,
      paymentAmount,
      blingProducts,
      storedProducts,
      members,
      commissionPercent,
      memberCommissions,
      customer,
      ownerId,
      organizationId: organization.id,
    });
  }
}

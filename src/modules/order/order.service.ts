import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerTypes, OrderTypes, paymentMethodTypes } from 'src/enums';
import { OrderRepository } from './order.repository';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly organizationService: OrganizationService,
  ) {}

  async createOrder({
    slug,
    type,
    paymentMethod,
    paymentAmount,
    products,
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
    products: {
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

    return this.orderRepository.createOrder({
      slug,
      type,
      paymentMethod,
      paymentAmount,
      products,
      members,
      commissionPercent,
      memberCommissions,
      customer,
      ownerId,
      organizationId: organization.id,
    });
  }
}

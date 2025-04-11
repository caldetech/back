import { Injectable } from '@nestjs/common';
import { ComissionRepository } from './comission.repository';

@Injectable()
export class ComissionService {
  constructor(private readonly comissionRepository: ComissionRepository) {}

  findByOrderId(orderId: string) {
    return this.comissionRepository.findByOrderId(orderId);
  }

  findByUserId(userId: string) {
    return this.comissionRepository.findByUserId(userId);
  }
}

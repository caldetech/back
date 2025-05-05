import { BadRequestException, Injectable } from '@nestjs/common';
import ky from 'ky';
import { BlingTokensSchema } from 'src/schemas/bling-tokens';
import { OrganizationService } from '../organization/organization.service';
import { BlingRepository } from './bling.repository';
import type {
  BlingProduct,
  BlingProductResponse,
} from 'src/schemas/bling-product';

@Injectable()
export class BlingService {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly blingRepository: BlingRepository,
  ) {}

  async searchProducts({ slug, query }: { slug: string; query: string }) {
    const tokens = await this.getValidAccessToken({ slug });

    const products = await ky
      .get('https://api.bling.com.br/Api/v3/produtos', {
        searchParams: { nome: query.toString(), limite: 3 },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '1.0',
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      .json<BlingProductResponse>();

    return products.data.map((item: BlingProduct) => ({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      precoCusto: item.precoCusto,
    }));
  }

  async getAuthorizeUrl({ slug }): Promise<{ url: string }> {
    const clientId = process.env.BLING_CLIENT_ID;

    return {
      url: `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${clientId}&state=${slug}`,
    };
  }

  async getTokens({ code, slug }: { code: string; slug: string }) {
    const clientId = process.env.BLING_CLIENT_ID;
    const clientSecret = process.env.BLING_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('BLING_CLIENT_ID ou BLING_CLIENT_SECRET não definidos');
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const requestBody = new URLSearchParams();

    requestBody.append('grant_type', 'authorization_code');
    requestBody.append('code', code);

    const response = await ky.post(
      'https://www.bling.com.br/Api/v3/oauth/token',
      {
        body: requestBody.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '1.0',
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    const json = await response.json<BlingTokensSchema>();

    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    const expiresInSeconds = json.expires_in;
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    await this.updateOrCreateTokens({
      organizationId: organization?.id,
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresAt,
    });

    return json;
  }

  async updateOrCreateTokens({
    organizationId,
    accessToken,
    refreshToken,
    expiresAt,
  }) {
    return await this.blingRepository.updateOrCreateTokens({
      organizationId,
      accessToken,
      refreshToken,
      expiresAt,
    });
  }

  async getTokensByOrganizationId(organizationId: string) {
    return this.blingRepository.getTokensByOrganizationId(organizationId);
  }

  async getTokensByOrganizationSlug(slug: string) {
    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (!organization) {
      throw new BadRequestException('Organização não encontrada');
    }

    return this.blingRepository.getTokensByOrganizationSlug(organization?.id);
  }

  async getValidAccessToken({ slug }: { slug: string }) {
    const token = await this.getTokensByOrganizationSlug(slug);

    if (!token) throw new Error('Token não encontrado');

    if (token.expiresAt.getTime() > Date.now()) {
      return token;
    }

    const clientId = process.env.BLING_CLIENT_ID;
    const clientSecret = process.env.BLING_CLIENT_SECRET;
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const requestBody = new URLSearchParams();

    requestBody.append('grant_type', 'refresh_token');
    requestBody.append('refresh_token', token.refreshToken);

    const response = await ky.post(
      'https://www.bling.com.br/Api/v3/oauth/token',
      {
        body: requestBody.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '1.0',
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    const json = await response.json<BlingTokensSchema>();

    const newExpiresAt = new Date(Date.now() + json.expires_in * 1000);

    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (!organization) {
      throw new BadRequestException('Organização não encontrada');
    }

    await this.blingRepository.updateOrCreateTokens({
      organizationId: organization.id,
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresAt: newExpiresAt,
    });

    return token;
  }

  async getProducts({
    accessToken,
    page = 1,
    limit = 5,
  }): Promise<BlingProductResponse> {
    const response = await ky
      .get('https://api.bling.com.br/Api/v3/produtos', {
        searchParams: { pagina: page.toString(), limite: limit },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '1.0',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .json<BlingProductResponse>();

    const filteredData = response.data.map((item: BlingProduct) => ({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      precoCusto: item.precoCusto,
    }));

    return {
      data: filteredData,
    };
  }
}

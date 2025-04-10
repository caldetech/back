import { Injectable } from '@nestjs/common';
import ky from 'ky';

@Injectable()
export class BlingService {
  async getAuthorizeUrl(): Promise<{ url: string }> {
    const clientId = process.env.BLING_CLIENT_ID;
    const state = 'any';

    return {
      url: `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${clientId}&state=${state}`,
    };
  }

  async getTokens({ code }: { code: string }) {
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

    return await response.json();
  }
}

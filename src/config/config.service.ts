// config/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService extends NestConfigService {
  constructor() {
    dotenv.config();
    super();
  }
}

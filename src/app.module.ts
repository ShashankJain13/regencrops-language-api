import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TranslationModule } from './translation/translation.module';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
// import { QueryValidationPipe } from './pipes/query-validation.pipe';
import { MulterModule } from '@nestjs/platform-express';




@Module({
  imports: [
    TranslationModule, ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    MulterModule.register({
      dest: './uploads', // Destination folder for storing uploaded files
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
  //    {
  //   provide: APP_PIPE,
  //   useClass: QueryValidationPipe,
  // },
],
})
export class AppModule {}

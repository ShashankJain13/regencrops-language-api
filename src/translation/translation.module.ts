import { Module } from '@nestjs/common';
import { TransalationController } from './translation.controller';
import { TranslationService } from './translation.service';
import {AwsS3Service} from '../s3/s3.service'


@Module({
    controllers: [TransalationController],
    providers: [TranslationService, AwsS3Service ],

})
export class TranslationModule {


}

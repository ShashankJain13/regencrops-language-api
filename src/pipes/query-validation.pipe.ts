import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class QueryValidationPipe implements PipeTransform<any> {
  constructor(private readonly requiredParams: string[]) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No query parameters provided');
    }

    // Check if all required parameters are present
    for (const param of this.requiredParams) {
      if (!(param in value)) {
        throw new BadRequestException(`Missing required query parameter: ${param}`);
      }
    }

    return value;
  }
}

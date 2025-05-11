import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ContractStatus } from "../enums/contracts/contracts.enum";

@Injectable()
export class ContractStatusValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const num = Number(value);

    const validValues = [0, ...Object.values(ContractStatus).filter(v => typeof v === 'number')];
    if (!validValues.includes(num)) {
      throw new BadRequestException(`Invalid filter value: ${value}`);
    }

    return num;
  }
}
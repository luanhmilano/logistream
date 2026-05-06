import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsNotEmpty,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { Type } from 'class-transformer';

// 1. O que esperamos de cada item na requisição HTTP
class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

// 2. Coordenadas e endereço
class DestinationDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsString()
  @IsNotEmpty()
  address: string;
}

// 3. O Payload principal da requisição (POST /orders)
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ValidateNested()
  @Type(() => DestinationDto) // Necessário para validar objetos aninhados
  destination: DestinationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

import { IsNotEmpty } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  photo: string;

  @IsNotEmpty()
  photoCardQuantity: number;

  @IsNotEmpty()
  activationCode: string;

  @IsNotEmpty()
  isActivated: boolean;
}

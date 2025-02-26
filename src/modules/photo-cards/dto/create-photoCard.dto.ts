import { IsNotEmpty } from 'class-validator';

export class CreatePhotoCardDto {
  @IsNotEmpty()
  photoCard: string;

  @IsNotEmpty()
  entertainmentCompany: string;

  @IsNotEmpty()
  groupName: string;

  @IsNotEmpty()
  memberName: string;

  @IsNotEmpty()
  collectionName: string;

  @IsNotEmpty()
  version: string;

  @IsNotEmpty()
  activationCode: string;
}

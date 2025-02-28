import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  entertainmentCompany: string;

  @IsNotEmpty()
  groupName: string;

  @IsNotEmpty()
  memberCount: number;

  @IsNotEmpty()
  @IsJSON()
  members: any;

  @IsNotEmpty()
  photo: string;

  @IsNotEmpty()
  memberPhoto: JSON;

  @IsNotEmpty()
  collectionQuantity: number;
}

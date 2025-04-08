import { IsNotEmpty, IsString } from 'class-validator';

export class RechercheDto {
  @IsString()
  @IsNotEmpty()
  terme: string;

  @IsNotEmpty()
  utilisateurId: number;
}
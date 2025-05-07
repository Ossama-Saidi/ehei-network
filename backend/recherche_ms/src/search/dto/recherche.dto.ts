import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RechercheDto {
  @IsString()
  @IsNotEmpty()
  terme: string;

  @IsNumber()
  @IsNotEmpty()
  utilisateurId: number;
}

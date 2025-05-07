import { IsInt, IsNotEmpty } from "class-validator";

export class savePublicationDto {
    @IsInt()
    @IsNotEmpty()
    id_user: number;
    
    @IsInt()
    @IsNotEmpty()
    id_publication: number
}

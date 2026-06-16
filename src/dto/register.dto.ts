import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsEmail({}, { message: "L'adresse email n'est pas valide" })
    @IsNotEmpty({ message: "L'email est obligatoire" })
    email: string;

    @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
    @IsNotEmpty({ message: "Le mot de passe est obligatoire" })
    password: string;
}

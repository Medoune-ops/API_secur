import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from "typeorm";
import { IsEmail, MinLength, IsNotEmpty } from "class-validator";

@Entity()
export class User {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column({ unique: true })
    @IsEmail({}, { message: "L'adresse email n'est pas valide" })
    @IsNotEmpty({ message: "L'email est obligatoire" })
    email: string;

    @Column()
    @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
    password: string;

    @CreateDateColumn()
    createdAt: Date;
}
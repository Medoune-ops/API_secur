import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from "typeorm";
import { IsEmail, MinLength, IsNotEmpty } from "class-validator";

@Entity()
export class User {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ unique: true })
    @IsEmail({}, { message: "L'adresse email n'est pas valide" })
    @IsNotEmpty({ message: "L'email est obligatoire" })
    email: string;

    @Column()
    @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
    password: string;

    @Column({ default: "user" })
    role: string;

    @Column({ nullable: true })
    shopName?: string;

    @Column({ nullable: true })
    shopDescription?: string;

    @Column({ type: "array", nullable: true, default: [] })
    cart: object[];

    @Column({ type: "array", nullable: true, default: [] })
    wishlist: object[];

    @CreateDateColumn()
    createdAt: Date;
}
import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn() // Ne pas oublier les parenthèses ()
    _id: ObjectId;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @CreateDateColumn()
    createdAt: Date;
}
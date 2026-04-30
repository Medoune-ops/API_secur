import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn() 
    _id: ObjectId;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;
}
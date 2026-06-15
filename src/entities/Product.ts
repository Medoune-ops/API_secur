import { Entity, Column, CreateDateColumn, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class Product {
    @ObjectIdColumn()
    _id!: ObjectId;

    @Column()
    name!: string;

    @Column("float")
    price!: number;

    @Column("float", { nullable: true })
    oldPrice?: number;

    @Column()
    imageUrl!: string;

    @Column("float", { default: 4.5 })
    rating!: number;

    @Column({ default: 0 })
    reviewsCount!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
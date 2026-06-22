import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Order {
    @ObjectIdColumn()
    _id!: ObjectId;

    @Column()
    userId!: string;

    @Column()
    items!: object[];

    @Column()
    totalAmount!: number;

    @Column()
    paymentMethod!: string; // "cash" | "mobile_money"

    @Column({ nullable: true })
    mobileMoneyPhone?: string;

    @Column()
    deliveryMethod!: string; // "delivery" | "pickup"

    @Column({ nullable: true })
    deliveryAddress?: string;

    @Column({ default: "pending" })
    status!: string; // "pending" | "confirmed" | "delivered" | "cancelled"

    @CreateDateColumn()
    createdAt!: Date;
}

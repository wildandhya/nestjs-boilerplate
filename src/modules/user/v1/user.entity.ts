import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Index()
    @Column({ type: "text", nullable: true })
    full_name: string

    @Index()
    @Column({ type: "uuid", nullable: true })
    tenant_id: string

    @Column("text")
    email: string

    @Column("text")
    password: string

    @Column("text")
    salt: string

    @Index()
    @Column("text")
    role: string

    @Index()
    @Column("text")
    user_type: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

   @DeleteDateColumn()
    deletedAt: Date

    @Column({ type: "text", nullable: true })
    createdBy: string

    @Column({ type: "text", nullable: true })
    updatedBy: string

    @Column({ type: "text", nullable: true })
    deletedBy: string
}

// id UUID PRIMARY KEY DEFAULT gen_random_uuid()
// full_name TEXT NOT NULL 
// tenant_id UUID
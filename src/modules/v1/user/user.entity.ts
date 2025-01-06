import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"users"})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Index()
    @Column({type:"text", nullable:true})
    full_name: string

    @Index()
    @Column({type:"uuid",nullable:true})
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

}

// id UUID PRIMARY KEY DEFAULT gen_random_uuid()
// full_name TEXT NOT NULL 
// tenant_id UUID
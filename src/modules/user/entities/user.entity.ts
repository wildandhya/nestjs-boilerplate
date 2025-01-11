import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { UserPermission, UserRole, UserType } from "src/lib/enums";
import { decrypt, encrypt, hash } from "src/lib/shared/utils/encryption.utils";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ApiExtraModels()
@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty()
  id: string

  @Index()
  @Column({ type: "text", nullable: true })
  @ApiProperty()
  name: string

  @Index()
  @Column({ type: "uuid", nullable: true })
  @ApiProperty()
  tenant_id: string

  @Column({
    type: "text",
    transformer: {
      to: (value: string) => encrypt(value),
      from: (value: string) => decrypt(value),
    }
  })
  @ApiProperty()
  email: string

  @Column("text")
  @Exclude()
  emailHash: string

  @Column("text")
  @Exclude()
  password: string

  @Column("text")
  @Exclude()
  salt: string

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  @ApiProperty()
  role: string

  @Column({
    type: "enum",
    enum: UserType,
    default: UserType.CUSTOMER
  })
  @ApiProperty()
  user_type: string

  @Column("text", { array: true, default: [] })
  @ApiProperty()
  permissions: UserPermission[]

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date

  @DeleteDateColumn()
  @ApiProperty()
  deletedAt: Date

  @Column({ type: "text", nullable: true })
  @ApiProperty()
  createdBy: string

  @Column({ type: "text", nullable: true })
  @ApiProperty()
  updatedBy: string

  @Column({ type: "text", nullable: true })
  @ApiProperty()
  deletedBy: string

  @BeforeInsert()
  @BeforeUpdate()
  async setEmailHash() {
    if (this.email) {
      this.emailHash = hash(this.email); // Hash the email value before saving
    }
  }

  @BeforeInsert()
  async setPermission() {
    if (!this.permissions || (Array.isArray(this.permissions.length) && !this.permissions.length)) {
      if (this.user_type === UserType.INTERNAL) {
        if (this.role === UserRole.ADMIN) {
          this.permissions = [
            UserPermission.READ_USERS,
            UserPermission.READ_ALL_USERS,
            UserPermission.UPDATE_USER,
            UserPermission.DELETE_USER,
          ];
        } else if (this.role === UserRole.USER) {
          this.permissions = [UserPermission.READ_USERS];
        }
      }

      if (this.user_type === UserType.CUSTOMER) {
        if (this.role === UserRole.ADMIN) {
          this.permissions = [UserPermission.READ_USERS, UserPermission.UPDATE_USER];
        } else if (this.role === UserRole.USER) {
          this.permissions = [UserPermission.READ_USERS];
        }
      }
    }
  }
}
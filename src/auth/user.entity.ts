// src/auth/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ default: 0 })
  score: number

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }
}
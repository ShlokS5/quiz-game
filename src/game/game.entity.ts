import { User } from 'src/auth/user.entity'
import { Question } from 'src/question/questions.entity'
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  player1: string

  @Column()
  player2: string

  @Column()
  questions: Question[]

  @Column({ default: 0 })
  player1Score: number

  @Column({ default: 0 })
  player2Score: number

  @Column({ default: 'waiting' })
  status: 'waiting' | 'in_progress' | 'completed'

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

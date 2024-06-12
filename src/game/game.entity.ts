// src/game/game.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  player1: string

  @Column()
  player2: string

  @Column('jsonb')
  questions: any[]

  @Column({ default: 0 })
  score1: number

  @Column({ default: 0 })
  score2: number

  @Column({ default: false })
  finished: boolean
}

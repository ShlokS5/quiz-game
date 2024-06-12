import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Game } from 'src/game/game.entity'

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  questionText: string

  @Column()
  choices: string[]

  @Column()
  correctAnswer: string

  @ManyToOne(() => Game, game => game.questions)
  game: Game

  @Column({ nullable: true })
  player1Answer: string

  @Column({ nullable: true })
  player2Answer: string
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @Column('simple-array')
  choices: string[]

  @Column()
  correctAnswer: string
}

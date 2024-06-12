import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Question } from 'src/question/questions.entity'
import { Game } from './game.entity'

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @InjectRepository(Question) private questionRepository: Repository<Question>,
  ) {}

  async createGame(username: string): Promise<Game> {
    const game = this.gameRepository.create({ player1: username, status: 'waiting' })
    return this.gameRepository.save(game)
  }

  async joinGame(username: string): Promise<Game> {
    let game = await this.gameRepository.findOne({ where: { status: 'waiting' }, relations: ['player1', 'player2'] })
    if (!game) {
      game = await this.createGame(username)
    } else {
      game.player2 = username
      game.status = 'in_progress'
      await this.gameRepository.save(game)
    }
    return game
  }

  async getQuestions(): Promise<Question[]> {
    return this.questionRepository.find({ take: 6 })
  }

  async submitAnswer(gameId: number, username: string, questionId: number, answer: string): Promise<void> {
    const game = await this.gameRepository.findOne({ where: {id: gameId}})
    const question = game.questions.find(q => q.id === questionId)
    if (!question) throw new Error('Question not found in game')
    if (game.player1 === username) {
      question.player1Answer = answer
    } else if (game.player2 === username) {
      question.player2Answer = answer
    }
    await this.questionRepository.save(question)
  }

  async calculateScores(gameId: number): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: {id: gameId}})
    game.player1Score = 0
    game.player2Score = 0
    for (const question of game.questions) {
      const questionData = await this.questionRepository.findOne({where: {id: question.id}})
      if (question.player1Answer === questionData.correctAnswer) game.player1Score++
      if (question.player2Answer === questionData.correctAnswer) game.player2Score++
    }
    game.status = 'completed'
    await this.gameRepository.save(game)
    return game
  }
}

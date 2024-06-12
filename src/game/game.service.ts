import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Game } from './game.entity'

@Injectable()
export class GameService {
  constructor(@InjectRepository(Game) private gameRepository: Repository<Game>) {}

  async createGame(player1: string, player2: string, questions: any[]): Promise<Game> {
    const game = this.gameRepository.create({ player1, player2, questions })
    return this.gameRepository.save(game)
  }

  async updateScore(gameId: number, player: string, score: number): Promise<Game> {
    const game = await this.gameRepository.findOne({where: {id: gameId}})
    if (player === game.player1) {
      game.score1 += score
    } else if (player === game.player2) {
      game.score2 += score
    }
    return this.gameRepository.save(game)
  }

  async finishGame(gameId: number): Promise<Game> {
    const game = await this.gameRepository.findOne({where: {id: gameId}})
    game.finished = true
    return this.gameRepository.save(game)
  }

  async getGame(gameId: number): Promise<Game> {
    return this.gameRepository.findOne({where: {id: gameId}})
  }
}

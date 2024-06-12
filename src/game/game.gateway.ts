// src/game/game.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import { GameService } from './game.service'
import { Socket } from 'socket.io'

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('game:init')
  async handleGameInit(@MessageBody() data: { player1: string, player2: string, questions: any[] }, @ConnectedSocket() client: Socket) {
    const game = await this.gameService.createGame(data.player1, data.player2, data.questions)
    client.emit('game:init', game)
  }

  @SubscribeMessage('answer:submit')
  async handleAnswerSubmit(@MessageBody() data: { gameId: number, player: string, score: number }, @ConnectedSocket() client: Socket) {
    const game = await this.gameService.updateScore(data.gameId, data.player, data.score)
    if (game.score1 + game.score2 === 6) { // assuming 6 questions total
      await this.gameService.finishGame(game.id)
      client.emit('game:end', game)
    } else {
      client.emit('answer:submit', game)
    }
  }
}

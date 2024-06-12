import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { GameService } from './game.service'

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  constructor(private gameService: GameService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized')
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(client: Socket, data: { username: string }) {
    const game = await this.gameService.joinGame(data.username)
    client.join(game.id.toString())
    if (game.player2) {
      this.server.to(game.id.toString()).emit('startGame', { gameId: game.id })
    }
  }

  @SubscribeMessage('nextQuestion')
  async handleNextQuestion(client: Socket, data: { gameId: number }) {
    const questions = await this.gameService.getQuestions()
    this.server.to(data.gameId.toString()).emit('question', questions)
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(client: Socket, data: { gameId: number, username: string, questionId: number, answer: string }) {
    await this.gameService.submitAnswer(data.gameId, data.username, data.questionId, data.answer)
    // Notify both players if both have answered
    // This is a simplified example and should be expanded with more robust logic
    const game = await this.gameService.calculateScores(data.gameId)
    this.server.to(data.gameId.toString()).emit('gameOver', game)
  }
}

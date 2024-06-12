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

  @WebSocketServer() 
  server: Server

  constructor(private gameService: GameService) {}

  afterInit() {
    console.log('WebSocket server initialized')
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('game:init')
  async handleJoinGame(client: Socket, data: { username: string }) {
    const game = await this.gameService.joinGame(data.username)
    client.join(game.id.toString())
    if (game.player2) {
      this.server.to(game.id.toString()).emit('startGame', { gameId: game.id })
    }
  }

  @SubscribeMessage('question:send')
  async handleNextQuestion(client: Socket, data: { gameId: number }) {
    const questions = await this.gameService.getQuestions()
    this.server.to(data.gameId.toString()).emit('question', questions)
  }

  @SubscribeMessage('answer:submit')
  async handleSubmitAnswer(client: Socket, data: { gameId: number, username: string, questionId: number, answer: string }) {
    await this.gameService.submitAnswer(data.gameId, data.username, data.questionId, data.answer)
    // Notify both players if both have answered
    const game = await this.gameService.calculateScores(data.gameId)
    this.server.to(data.gameId.toString()).emit('game:end', game)
  }
}

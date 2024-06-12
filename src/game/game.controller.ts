
import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { GameService } from './game.service'

@Controller('game')
export class AuthController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('start')
  async register(@Body() username: string) {
    return this.gameService.joinGame(username)
  }

}

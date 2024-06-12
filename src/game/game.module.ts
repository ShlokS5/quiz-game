// src/game/game.module.ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GameService } from './game.service'
import { GameGateway } from './game.gateway'
import { Game } from './game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GameService, GameGateway],
})
export class GameModule {}

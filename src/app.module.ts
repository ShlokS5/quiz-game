import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { GameModule } from './game/game.module'
import { QuestionModule } from './question/question.module'
import { User } from './auth/user.entity'
import { Game } from './game/game.entity'
import { Question } from './question/questions.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('MONGODB_URI'),
        entities: [User, Game, Question],
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    GameModule,
    QuestionModule,
  ],
})
export class AppModule {}

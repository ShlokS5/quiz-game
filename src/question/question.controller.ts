// src/question/question.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common'
import { QuestionService } from './question.service'

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() createQuestionDto: any) {
    return this.questionService.createQuestion(createQuestionDto)
  }

  @Get()
  async findAll() {
    return this.questionService.getAllQuestions()
  }
}

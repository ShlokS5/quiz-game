// src/question/question.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Question } from './questions.entity'

@Injectable()
export class QuestionService {
  constructor(@InjectRepository(Question) private questionRepository: Repository<Question>) {}

  async createQuestion(createQuestionDto: any) {
    const question = this.questionRepository.create(createQuestionDto)
    return this.questionRepository.save(question)
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.questionRepository.find()
  }
}

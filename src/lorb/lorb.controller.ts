import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateLorBDto } from './dto/create-lorb';
import { LorbService } from './lorb.service';

@Controller('lorb')
export class LorbController {
  constructor(private readonly lorbService: LorbService) {}
  @Post('createLorB')
  createLorB(@Body(ValidationPipe) createLorBPayload: CreateLorBDto) {
    console.log(createLorBPayload, 'ペイロード');
    return this.lorbService.createLorB(createLorBPayload);
  }
}

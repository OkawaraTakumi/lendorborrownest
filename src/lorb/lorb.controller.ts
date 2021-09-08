import { Controller, Post } from '@nestjs/common';
import { CreateLorBDto } from './dto/create-lorb';
import { LorbService } from './lorb.service';

@Controller('lorb')
export class LorbController {
  constructor(private readonly lorbService: LorbService) {}
  @Post('createLorB')
  createLorB(createLorBPayload: CreateLorBDto) {
    return this.lorbService.createLorB(createLorBPayload);
  }
}

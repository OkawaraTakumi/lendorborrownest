import { Body, Controller, Post, Put, ValidationPipe } from '@nestjs/common';
import { ChengeStateDto } from './dto/approve-create.dto';
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

  @Put('approveCreate')
  approveCreate(@Body(ValidationPipe) approveCreatePayload: ChengeStateDto) {
    return this.lorbService.approveCreate(approveCreatePayload);
  }

  @Put('rejectCreate')
  rejectCreate(@Body(ValidationPipe) rejectCreatePayload: ChengeStateDto) {
    return this.lorbService.approveCreate(rejectCreatePayload);
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChengeStateDto } from './dto/approve-create.dto';
import { CreateLorBDto } from './dto/create-lorb';
import { deleteDto } from './dto/delete-lorb.dto';
import { updateNegotiateDto } from './dto/upadate-negotiate.dto';
import { LorbService } from './lorb.service';

@Controller('lorb')
export class LorbController {
  constructor(private readonly lorbService: LorbService) {}
  @Post('createLorB')
  createLorB(@Body(ValidationPipe) createLorBPayload: CreateLorBDto) {
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

  @Put('rejectNegotiate')
  rejectNegotiate(
    @Body(ValidationPipe) rejectNegotiatePayload: ChengeStateDto
  ) {
    return this.lorbService.approveCreate(rejectNegotiatePayload);
  }

  @Get('getOnMaking')
  @UseGuards(AuthGuard('jwt'))
  getOnMaking(@Request() req: any) {
    return this.lorbService.getOnMaking(req.user.id);
  }

  @Get('getOnBeingSuggested')
  @UseGuards(AuthGuard('jwt'))
  getOnBeingSuggested(@Request() req: any) {
    return this.lorbService.getOnBeingSuggested(req.user.id);
  }

  @Get('getLorBCompleted')
  @UseGuards(AuthGuard('jwt'))
  getLorBCompleted(@Request() req: any) {
    return this.lorbService.getLorBCompleted(req.user.id);
  }

  @Get('getLorBKeepLorB')
  @UseGuards(AuthGuard('jwt'))
  getLorBKeepLorB(@Request() req: any) {
    return this.lorbService.getLorBKeepLorB(req.user.id);
  }

  @Put('deleteLorBtable')
  @UseGuards(AuthGuard('jwt'))
  deleteLorBtable(@Body(ValidationPipe) deletePayload: deleteDto) {
    return this.lorbService.deleteLorBtable(deletePayload);
  }

  @Put('updateNegotiate')
  @UseGuards(AuthGuard('jwt'))
  updateNegotiate(
    @Body(ValidationPipe) updateNegotiatePayload: updateNegotiateDto
  ) {
    return this.lorbService.updateNegotiate(updateNegotiatePayload);
  }
}

import { Module } from '@nestjs/common';
import { LorbController } from './lorb.controller';
import { LorbService } from './lorb.service';

@Module({
  controllers: [LorbController],
  providers: [LorbService]
})
export class LorbModule {}

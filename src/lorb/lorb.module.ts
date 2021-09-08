import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { LorBSchema } from 'src/schema/lorb.schema';
import { LorbController } from './lorb.controller';
import { LorbService } from './lorb.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'LorB', schema: LorBSchema }]),
    AuthModule,
  ],
  controllers: [LorbController],
  providers: [LorbService],
})
export class LorbModule {}

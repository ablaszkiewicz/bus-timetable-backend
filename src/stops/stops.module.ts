import { Module } from '@nestjs/common';
import { StopsService } from './stops.service';
import { StopsController } from './stops.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Stop, StopSchema } from './entities/stop.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Stop.name, schema: StopSchema }]),
  ],
  controllers: [StopsController],
  providers: [StopsService],
})
export class StopsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StopsModule } from './stops/stops.module';

@Module({
  imports: [
    StopsModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://mongo:Rakoczego19@cluster0.n6jywaf.mongodb.net/?',
      { dbName: 'bus-timetable-backend' },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

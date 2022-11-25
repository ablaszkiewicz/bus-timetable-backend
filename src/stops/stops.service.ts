import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CreateStopDto } from './dto/create-stop.dto';
import { Stop, StopDocument } from './entities/stop.entity';

@Injectable()
export class StopsService {
  constructor(
    private httpService: HttpService,
    @InjectModel(Stop.name) private stopModel: Model<StopDocument>,
  ) {}

  public async getAll(): Promise<any> {
    const stops = await this.stopModel.find().exec();
    return stops;
  }

  public async getContaining(phrase: string): Promise<Stop[]> {
    return this.stopModel.find({ name: new RegExp(phrase, 'i') }).exec();
  }

  private async create(dto: CreateStopDto): Promise<Stop> {
    const createdStop = new this.stopModel(dto);
    return createdStop.save();
  }

  public async initialize(): Promise<void> {
    await this.stopModel.deleteMany({}).exec();
    const response = await firstValueFrom(
      this.httpService.get(
        'https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json',
      ),
    );

    const stops = response.data;
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const filteredStops = stops[todayFormatted].stops;

    const promises = filteredStops.map((stop) => {
      return this.create({
        id: +stop.stopId,
        name: stop.stopName + ' ' + stop.subName,
        description: stop.stopDesc,
        lat: +stop.stopLat,
        lon: +stop.stopLon,
      });
    });

    await Promise.all(promises);
  }

  public async getWithinExtent(
    xMin: number,
    yMin: number,
    xMax: number,
    yMax: number,
  ): Promise<Stop[]> {
    return this.stopModel
      .find({
        lat: { $gte: yMin, $lte: yMax },
        lon: { $gte: xMin, $lte: xMax },
      })
      .exec();
  }
}

import { Controller, Get, Post, Param } from '@nestjs/common';
import { StopsService } from './stops.service';

@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get()
  findAll() {
    return this.stopsService.getAll();
  }

  @Get('contains/:contains')
  getStartingWith(@Param('contains') phrase: string) {
    return this.stopsService.getContaining(phrase);
  }

  @Post('initialize')
  initialize() {
    return this.stopsService.initialize();
  }
}

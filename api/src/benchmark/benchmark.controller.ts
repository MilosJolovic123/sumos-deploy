import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BenchmarkService } from './benchmark.service';

@Controller('api/benchmark')
export class BenchmarkController {
  constructor(private readonly benchmarkService: BenchmarkService) {}

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  async overview() {
    return this.benchmarkService.getOverview();
  }

  @Get('single/:code')
  @HttpCode(HttpStatus.OK)
  async single(@Param('code') code: string) {
    return this.benchmarkService.getSingleResult(code);
  }

  @Post('filter')
  @HttpCode(HttpStatus.OK)
  async filter(@Body() filters: Record<string, string | undefined>) {
    return this.benchmarkService.getFilteredAverages(filters);
  }

  @Post('compare')
  @HttpCode(HttpStatus.OK)
  async compare(
    // Frontend ti šalje JSON: { "myBenchmarkCode": "ABC", "otherBenchmarkCode": "XYZ" }
    @Body('myBenchmarkCode') myCode: string,
    @Body('otherBenchmarkCode') otherCode: string,
  ) {
    return this.benchmarkService.compareResults(myCode, otherCode);
  }
}

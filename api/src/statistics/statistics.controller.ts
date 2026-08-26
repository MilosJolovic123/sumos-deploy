import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('api/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('get-stats')
  @HttpCode(HttpStatus.OK)
  async getDashboard() {
    return await this.statisticsService.getDashboardStats();
  }

  @Get('average-completion-time')
  @HttpCode(HttpStatus.OK)
  async getAverageCompletionTime() {
    const averageCompletionTimeMs = await this.statisticsService.getAverageCompletionTimeMs();
    return {
      averageCompletionTimeMs,
      averageCompletionTimeSeconds: averageCompletionTimeMs / 1000,
    };
  }
}

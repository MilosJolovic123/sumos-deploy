import { Body, Controller, Post } from '@nestjs/common';
import { SubmissionsService } from './submission.service';

@Controller('api/submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  async submitSurvey(@Body() body: any) {
    return this.submissionsService.processSubmission(body);
  }

  @Post('send-results-email')
  async sendResultsEmail(@Body() body: { benchmarkCode: string; email: string }) {
    return this.submissionsService.sendResultsEmailByCode(
      body.benchmarkCode,
      body.email,
    );
  }
}

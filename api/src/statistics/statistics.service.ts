import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { get, Model } from 'mongoose';
import { Result, ResultDocument } from '../schemas/result.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
  ) {}

  async getDashboardStats() {
    // 1. Izvlačimo ecoScore, categoryScores i SADA DODAJEMO badge iz baze
    const allResults = await this.resultModel
      .find(
        { isRealAttempt: true },
        { ecoScore: 1, categoryScores: 1, badge: 1, durationMs: 1, completionTimeSeconds: 1 },
      )
      .lean()
      .exec();

    // 2. Provera na praznu bazu (poruke na engleskom)
    if (!allResults || allResults.length === 0) {
      return this.getEmptyStats();
    }

    const totalSurveys = allResults.length;
    const averageCompletionTimeMs = this.calculateAverageCompletionTimeMs(allResults);

    // Zbirovi za proseke
    let ecoSum = 0;
    let awarenessSum = 0;
    let attitudesSum = 0;
    let habitsSum = 0;
    let barriersSum = 0;

    // Objekat za prebrojavanje bedževa
    const badgeCounts: Record<string, number> = {};

    // 3. Prolazimo kroz svaki rezultat u bazi
    for (const result of allResults) {
      // Sabiranje skorova
      ecoSum += result.ecoScore || 0;
      awarenessSum += this.getScoreValue(result.categoryScores, 'Awareness');
      attitudesSum += this.getScoreValue(result.categoryScores, 'Attitudes');
      habitsSum += this.getScoreValue(result.categoryScores, 'Habits');
      barriersSum += this.getScoreValue(result.categoryScores, 'Barriers');

      // Prebrojavanje bedževa (mnogo prostije sad!)
      const currentBadge = result.badge || 'Unknown badge';

      if (!badgeCounts[currentBadge]) {
        badgeCounts[currentBadge] = 0;
      }
      badgeCounts[currentBadge]++;

      console.log(
        `All sums fetched: ${awarenessSum}, ${attitudesSum}, ${habitsSum}, ${barriersSum}`,
      );
    }

    // 4. Nalazimo bedž sa najviše pojavljivanja
    let mostPopularBadge = 'No data available';
    let maxCount = 0;

    for (const badge in badgeCounts) {
      if (badgeCounts[badge] > maxCount) {
        maxCount = badgeCounts[badge];
        mostPopularBadge = badge;
      }
    }

    // 5. Vraćamo formatiran objekat (zbirove delimo sa ukupnim brojem)
    return {
      totalSurveys,
      mostPopularBadge,
      averageCompletionTimeMs,
      averageCompletionTimeSeconds: this.round(averageCompletionTimeMs / 1000),
      averages: {
        ecoScore: this.round(ecoSum / totalSurveys),
        awareness: this.round(awarenessSum / totalSurveys),
        attitudes: this.round(attitudesSum / totalSurveys),
        habits: this.round(habitsSum / totalSurveys),
        barriers: this.round(barriersSum / totalSurveys),
      },
    };
  }

  async getAverageCompletionTimeMs() {
    const allResults = await this.resultModel
      .find(
        { isRealAttempt: true },
        { durationMs: 1, completionTimeSeconds: 1 },
      )
      .lean()
      .exec();

    return this.calculateAverageCompletionTimeMs(allResults || []);
  }

  // --- Pomoćne metode ---

  private calculateAverageCompletionTimeMs(results: any[]): number {
    const values = results
      .map((result) => {
        if (typeof result.durationMs === 'number' && Number.isFinite(result.durationMs)) {
          return Math.max(0, result.durationMs);
        }
        if (
          typeof result.completionTimeSeconds === 'number' &&
          Number.isFinite(result.completionTimeSeconds)
        ) {
          return Math.max(0, result.completionTimeSeconds * 1000);
        }
        return null;
      })
      .filter((value): value is number => value !== null && value >= 0);

    if (values.length === 0) {
      return 0;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private round(value: number): number {
    return value ? parseFloat(value.toFixed(2)) : 0;
  }

  // Fallback kad nema podataka (sve na engleskom)
  private getEmptyStats() {
    return {
      totalSurveys: 0,
      mostPopularBadge: 'No data available',
      averageCompletionTimeMs: 0,
      averageCompletionTimeSeconds: 0,
      averages: {
        ecoScore: 0,
        awareness: 0,
        attitudes: 0,
        habits: 0,
        barriers: 0,
        count: 0,
      },
    };
  }

  // Ova funkcija proverava da li je Mongoose vratio Map klasu ili običan objekat
  private getScoreValue(scores: any, categoryName: string): number {
    if (!scores) return 0;

    // Ako objekat ima .get() metodu, znači da je to Mongoose Map
    if (typeof scores.get === 'function') {
      return scores.get(categoryName) || 0;
    }

    // U suprotnom, to je običan JSON objekat (POJO)
    return scores[categoryName] || 0;
  }
}

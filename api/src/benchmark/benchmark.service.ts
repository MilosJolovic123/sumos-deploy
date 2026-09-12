import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Result, ResultDocument } from '../schemas/result.schema';

const CATEGORY_KEYS = ['Awareness', 'Attitudes', 'Habits', 'Barriers'];
const HABIT_KEYS = ['Travel', 'Living', 'Consumption', 'Digital', 'Engagement'];
const OTHER_INSTITUTION = 'Other';
const COUNTRY_INSTITUTIONS: Record<string, string[]> = {
  Croatia: [
    'University of Zagreb, Faculty of Organization and Informatics Varaždin',
    OTHER_INSTITUTION,
  ],
  France: ['ESIEA Graduate School of Engineering', OTHER_INSTITUTION],
  Slovakia: [
    'University of Žilina, Faculty of Management Science and Informatics',
    OTHER_INSTITUTION,
  ],
  Slovenia: [
    'University of Maribor, Faculty of Organizational Sciences',
    OTHER_INSTITUTION,
  ],
  Serbia: [
    'University of Belgrade, Faculty of Organizational Sciences',
    OTHER_INSTITUTION
  ]
};

interface BenchmarkFilters {
  mobilityStatus?: string;
  country?: string;
  institution?: string;
  benchmarkCode?: string;
}

@Injectable()
export class BenchmarkService {
  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
  ) {}

  async getOverview() {
    const [groupData, countries] = await Promise.all([
      this.getFilteredAverages({}),
      this.getAvailableCountries(),
    ]);

    return { groupData, countries };
  }

  async getSingleResult(code: string) {
    if (typeof code !== 'string' || code.trim() === '') {
      throw new BadRequestException('A benchmark code is required.');
    }

    const result = await this.resultModel
      .findOne({ benchmarkCode: code.trim(), isRealAttempt: true })
      .lean()
      .exec();

    if (!result) {
      throw new NotFoundException('The benchmark code was not found.');
    }

    const population = await this.findFilteredResults({});
    return {
      ecoScore: result.ecoScore,
      categoryScores: this.normalizeCategoryScores(result.categoryScores),
      badge: result.badge,
      percentile: this.calculatePercentile(result.ecoScore, population),
    };
  }

  async getFilteredAverages(filters: BenchmarkFilters) {
    const results = await this.findFilteredResults(filters);
    const hasInstitutionMatch =
      !filters.institution?.trim() ||
      results.length > 0 ||
      !filters.country?.trim();

    const fallbackResults = hasInstitutionMatch
      ? results
      : await this.findFilteredResults({
          mobilityStatus: filters.mobilityStatus,
          country: filters.country,
        });

    const response = this.calculateAverages(fallbackResults);
    if (filters.benchmarkCode?.trim()) {
      const userResult = await this.resultModel
        .findOne(
          { benchmarkCode: filters.benchmarkCode.trim(), isRealAttempt: true },
          { ecoScore: 1 },
        )
        .lean()
        .exec();

      if (userResult) {
        return {
          ...response,
          userPercentile: this.calculatePercentile(
            userResult.ecoScore,
            fallbackResults,
          ),
        };
      }
    }

    return response;
  }

  private async findFilteredResults(filters: BenchmarkFilters) {
    const match: Record<string, unknown> = { isRealAttempt: true };
    if (filters.country?.trim()) match.state = filters.country.trim();
    if (filters.institution?.trim()) {
      match.institution = filters.institution.trim();
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: 'submissions',
          localField: 'submissionId',
          foreignField: '_id',
          as: 'submission',
        },
      },
    ];

    if (filters.mobilityStatus === 'Yes' || filters.mobilityStatus === 'No') {
      pipeline.push({
        $match: {
          'submission.mobilityDone': filters.mobilityStatus === 'Yes',
        },
      });
    }

    return this.resultModel.aggregate(pipeline).exec();
  }

  private async getAvailableCountries() {
    const results = await this.resultModel
      .find({ isRealAttempt: true }, { state: 1, institution: 1 })
      .lean()
      .exec();
    const byCountry = new Map<string, Set<string>>();

    for (const result of results) {
      const country = result.state?.trim();
      if (!country) continue;
      byCountry.set(country, new Set(COUNTRY_INSTITUTIONS[country] || [OTHER_INSTITUTION]));
    }

    return Array.from(byCountry.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([country, institutions]) => ({
        country,
        institutions: Array.from(institutions),
      }));
  }

  private calculateAverages(results: Array<Record<string, any>>) {
    const sums: Record<string, { sum: number; count: number }> = {};
    let ecoSum = 0;

    for (const result of results) {
      if (typeof result.ecoScore === 'number') ecoSum += result.ecoScore;
      const scores = this.normalizeCategoryScores(result.categoryScores);
      for (const key of [...CATEGORY_KEYS, ...HABIT_KEYS]) {
        if (typeof scores[key] !== 'number') continue;
        sums[key] = sums[key] || { sum: 0, count: 0 };
        sums[key].sum += scores[key];
        sums[key].count += 1;
      }
    }

    const average = (key: string) => {
      const entry = sums[key];
      return entry && entry.count > 0 ? this.round(entry.sum / entry.count) : 0;
    };

    return {
      averageScore: results.length ? this.round(ecoSum / results.length) : 0,
      categories: Object.fromEntries(
        CATEGORY_KEYS.map((key) => [key, average(key)]),
      ),
      habits: Object.fromEntries(HABIT_KEYS.map((key) => [key, average(key)])),
      resultCount: results.length,
    };
  }

  private normalizeCategoryScores(
    scores: Record<string, number> | Map<string, number> | undefined,
  ): Record<string, number> {
    if (scores instanceof Map) return Object.fromEntries(scores.entries());
    return scores || {};
  }

  private round(value: number) {
    return Number(value.toFixed(2));
  }

  private calculatePercentile(
    score: number,
    results: Array<Record<string, any>>,
  ) {
    if (!results.length) return 0;
    const betterThan = results.filter(
      (result) =>
        typeof result.ecoScore === 'number' && result.ecoScore < score,
    ).length;
    return Math.round((betterThan / results.length) * 100);
  }

  async compareResults(myCode: string, otherCode: string) {
    if (typeof myCode !== 'string' || typeof otherCode !== 'string') {
      throw new BadRequestException(
        'Invalid input: Benchmark codes must be textual.',
      );
    }

    if (myCode.trim() === '' || otherCode.trim() === '') {
      throw new BadRequestException(
        'Invalid input: Benchmark codes cannot be empty.',
      );
    }

    if (myCode === otherCode) {
      throw new BadRequestException(
        'Invalid input: You cannot compare the same benchmark code to itself.',
      );
    }

    if (!myCode || !otherCode) {
      throw new BadRequestException(
        'Invalid input: Both benchmark codes are required.',
      );
    }

    // Tražimo oba rezultata istovremeno (brže je nego jedan po jedan)
    const [myResult, otherResult] = await Promise.all([
      this.resultModel.findOne({ benchmarkCode: myCode }).exec(),
      this.resultModel.findOne({ benchmarkCode: otherCode }).exec(),
    ]);

    if (!myResult) {
      throw new NotFoundException(
        `Your result (code: ${myCode}) was not found in the database.`,
      );
    }

    if (!otherResult) {
      throw new NotFoundException(
        `Result for comparison (code: ${otherCode}) was not found in the database.`,
      );
    }

    // Vraćamo čist objekat sa podacima, bez osetljivih stvari poput emaila
    return {
      myData: {
        ecoScore: myResult.ecoScore,
        categoryScores: myResult.categoryScores,
        mobility: myResult.mobility,
      },
      otherData: {
        ecoScore: otherResult.ecoScore,
        categoryScores: otherResult.categoryScores,
        mobility: otherResult.mobility,
      },
    };
  }
}

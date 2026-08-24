import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CountrySchema, CountryDocument } from 'src/schemas/countries.shema';
@Injectable()
export class CountriesService implements OnModuleInit {
  private readonly logger = new Logger(CountriesService.name);
  private readonly cacheKey = 'COUNTRIES_LIST';
  private readonly cacheTtlMs = 86400000; // 24h

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel('Country') private countryModel: Model<CountryDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.countryModel.countDocuments().exec();
    if (count === 0) {
      this.logger.log('Kolekcija countries je prazna, seedujem pri startu...');
      const fresh = await this.fetchFromExternalApi();
      if (fresh.length) {
        await this.persistToDatabase(fresh);
        this.logger.log(`Seed uspešan, upisano ${fresh.length} zemalja.`);
      } else {
        this.logger.warn('Seed nije uspeo — API nedostupan pri startu. Fallback lanac u getCountryNames() će pokušati kasnije.');
      }
    }
  }

  @Cron('0 0 1 1,4,7,10 *')
  async scheduledRefresh(): Promise<void> {
    this.logger.log('Pokrećem zakazani kvartalni refresh liste zemalja...');
    const fresh = await this.refreshFromExternalApi();
    if (fresh.length) {
      this.logger.log(`Refresh uspešan, ${fresh.length} zemalja ažurirano.`);
    } else {
      this.logger.warn('Zakazani refresh nije uspeo, zadržavam postojeće podatke u bazi.');
    }
  }

  async getCountryNames(): Promise<string[]> {
    const cached = await this.cacheManager.get<string[]>(this.cacheKey);
    if (cached?.length) {
      return cached;
    }

    const fromDb = await this.getFromDatabase();
    if (fromDb.length) {
      await this.cacheManager.set(this.cacheKey, fromDb, this.cacheTtlMs);
      return fromDb;
    }

    this.logger.warn('DB kolekcija countries je prazna, pozivam eksterni API...');
    const fromApi = await this.fetchFromExternalApi();

    if (fromApi.length) {
      await this.persistToDatabase(fromApi);
      await this.cacheManager.set(this.cacheKey, fromApi, this.cacheTtlMs);
      return fromApi;
    }

    this.logger.error('Nije moguće dobaviti listu zemalja ni iz jednog izvora.');
    return [];
  }

  private async getFromDatabase(): Promise<string[]> {
    const docs = await this.countryModel.find().sort({ name: 1 }).exec();
    return docs.map((doc) => doc.name);
  }

  private async persistToDatabase(countries: string[]): Promise<void> {
    try {
      const ops = countries.map((name) => ({
        updateOne: {
          filter: { name },
          update: { $set: { name } },
          upsert: true,
        },
      }));
      await this.countryModel.bulkWrite(ops);
    } catch (err) {
      this.logger.error('Upis zemalja u bazu nije uspeo', err);
    }
  }

private readonly apiUrl = 'https://countries.dev/countries?fields=name';

private async fetchFromExternalApi(): Promise<string[]> {
  try {
    const { data } = await lastValueFrom(
      this.httpService.get(this.apiUrl, { timeout: 10000 }),
    );

    if (!Array.isArray(data)) {
      throw new Error(`API nije vratio niz (dobijeno: ${typeof data})`);
    }

    return data
      .map((country: any) => country.name)
      .filter((name: unknown): name is string => typeof name === 'string' && name.length > 0)
      .sort((a: string, b: string) => a.localeCompare(b));
  } catch (err) {
    this.logger.error('Poziv eksternog API-ja nije uspeo', err);
    return [];
  }
}

  async refreshFromExternalApi(): Promise<string[]> {
    const fresh = await this.fetchFromExternalApi();
    if (fresh.length) {
      await this.persistToDatabase(fresh);
      await this.cacheManager.set(this.cacheKey, fresh, this.cacheTtlMs);
    }
    return fresh;
  }
}
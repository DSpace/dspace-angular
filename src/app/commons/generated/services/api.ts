export * from './auth-api.service';
import { AuthApiService } from './auth-api.service';
export * from './cards-api.service';
import { CardsApiService } from './cards-api.service';
export * from './category-api.service';
import { CategoryApiService } from './category-api.service';
export * from './profile-api.service';
import { ProfileApiService } from './profile-api.service';
export const APIS = [AuthApiService, CardsApiService, CategoryApiService, ProfileApiService];

import { TestBed } from '@angular/core/testing';

import { FavoriteChallengesService } from './favorite-challenges.service';

describe('FavoriteChallengesService', () => {
  let service: FavoriteChallengesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteChallengesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

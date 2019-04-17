import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let localStorageService: LocalStorageService;
  beforeEach(() => {
    localStorageService = new LocalStorageService();
  });

  it('should be created', () => {
    expect(localStorageService).toBeTruthy();
  });
});

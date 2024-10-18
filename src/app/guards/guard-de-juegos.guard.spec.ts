import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardDeJuegosGuard } from './guard-de-juegos.guard';

describe('guardDeJuegosGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guardDeJuegosGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

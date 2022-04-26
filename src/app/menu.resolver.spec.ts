import { TestBed } from '@angular/core/testing';

import { MenuResolver } from './menu.resolver';

describe('MenuResolver', () => {
  let resolver: MenuResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MenuResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

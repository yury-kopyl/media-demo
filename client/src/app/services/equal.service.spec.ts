import { TestBed, inject } from '@angular/core/testing';

import { EqualService } from './equal.service';

describe('EqualService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EqualService]
    });
  });

  it('should be created', inject([EqualService], (service: EqualService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { Workshop } from './workshop';

describe('Workshop', () => {
  let service: Workshop;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Workshop);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

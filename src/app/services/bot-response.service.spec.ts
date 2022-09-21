import { TestBed } from '@angular/core/testing';

import { BotResponseService } from './bot-response.service';

describe('BotResponseService', () => {
  let service: BotResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

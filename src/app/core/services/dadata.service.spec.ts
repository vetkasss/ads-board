import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { DadataService } from './dadata.service';

const mockHttpClient = {
  post: jasmine.createSpy('post')
};

describe('DadataService', () => {
  let service: DadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });
    service = TestBed.inject(DadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
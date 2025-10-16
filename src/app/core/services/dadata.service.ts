import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DadataResponse } from '../models/dadata.model';
import { environment } from './enviroment';

@Injectable({
  providedIn: 'root'
})
export class DadataService {
  private http = inject(HttpClient);
  
  private apiUrl = environment.dadata.apiUrl;
  private token = environment.dadata.token;
  
  private readonly MIN_QUERY_LENGTH = 2;
  private readonly SUGGESTIONS_COUNT = 10;

  private makeDadataRequest(query: string, bounds?: { from: string; to: string }): Observable<DadataResponse> {
    if (!query?.trim() || query.trim().length < this.MIN_QUERY_LENGTH) {
      return of({ suggestions: [] });
    }

    const body: any = {
      query: query.trim(),
      count: this.SUGGESTIONS_COUNT,
      locations: [{ country: 'Россия' }]
    };

    if (bounds) {
      body.from_bound = { value: bounds.from };
      body.to_bound = { value: bounds.to };
    }

    console.log('Запрос к DaData:', query, bounds ? `(тип: ${bounds.from})` : '');

    return this.http.post<DadataResponse>(this.apiUrl, body, {
      headers: {
        'Authorization': `Token ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).pipe(
      tap(response => {
        const count = response.suggestions?.length || 0;
        const type = bounds ? 'городов' : 'адресов';
        console.log(`Получено ${count} подсказок ${type} от DaData`);
      }),
      catchError(error => {
        console.warn('Ошибка API DaData:', error.status, error.message);
        return of({ suggestions: [] });
      })
    );
  }

  getAddressSuggestions(query: string): Observable<DadataResponse> {
    return this.makeDadataRequest(query);
  }

  getCitySuggestions(query: string): Observable<DadataResponse> {
    return this.makeDadataRequest(query, { 
      from: 'city', 
      to: 'city' 
    });
  }
}
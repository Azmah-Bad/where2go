import { Injectable } from '@angular/core';
import { Countries, Country } from "./country";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QueryResult } from "./query-result";

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private API = 'http://127.0.0.1:8000/api/country/'

  constructor(
    private http:HttpClient
  ) { }


  getRelationships(country: string):Observable<QueryResult[]> {
    return this.http.get<QueryResult[]>(this.API + country + "/");
  }
}

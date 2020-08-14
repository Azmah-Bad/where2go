import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpennessService {
  private api: string;

  constructor(private http: HttpClient,) { }

  getOpenness():Observable<any> {
    return this.http.get("");
  }

}

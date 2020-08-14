import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoNames } from "./geo-names";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private api = "http://api.geonames.org/countryCodeJSON?"
  private username = "_hba_"

  constructor(private http: HttpClient) {}

  getPosition(): Observable<Position> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          observer.next(position);
        });
      } else {
        observer.error('Geolocation not available');
      }
    });
  }

  getCountry(position: Position): Observable<GeoNames> {
    const url = this.api + `lat=${position.coords.latitude}&lng=${position.coords.longitude}&username=` + this.username;
    return this.http.get<GeoNames>(url)

  }
}

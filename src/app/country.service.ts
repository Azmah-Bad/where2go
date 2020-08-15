import { Injectable } from '@angular/core';
import { Countries, Country } from "./country";

let countries: Countries = {
  Morocco: { openness:4},
  Germany: { openness:0}
};

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor() { }

  getCountries():Countries {
    return countries
  }
}

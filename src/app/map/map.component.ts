import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DxVectorMapComponent } from 'devextreme-angular';
import { LocationService } from '../services/location.service';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { CountryService } from "../services/country.service";
import { Countries, Country } from '../interfaces/country';
import { catchError, map, tap } from 'rxjs/operators';
import { Relationship } from '../interfaces/relationship';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  worldMap: any = mapsData.world;
  currentCountry: string;

  @ViewChild("theVectorMap", {static: false}) VectorMap: DxVectorMapComponent;

  constructor(
    private locationService: LocationService,
    private countryService: CountryService,
  ) {
    this.customizeLayers = this.customizeLayers.bind(this);
  }


  ngOnInit(): void {

    this.locationService.getPosition().subscribe((position) => {
      this.locationService.getCountry(position).subscribe((resp) => {
        this.VectorMap.instance.hideLoadingIndicator();
        // found the currentCountry
        this.currentCountry = resp.countryName;

        // update currentCountry color
        this.updateCountry(this.currentCountry, 0);

        // get other countries status
        this.countryService.getRelationships(this.currentCountry)
          .subscribe(
            (results) => {
              let relationships: Relationship[] = [];
              results.forEach((result) => { relationships.push( result.fields )});
              relationships.forEach((relationship) => {
                let mRelationship = new Relationship(relationship);

                if (mRelationship.departure_country == '*') {
                  this.updateAllCountries(mRelationship.getStatus());
                } else {
                  mRelationship.toCountryNames();
                  this.VectorMap.instance.getLayers()[0].getElements().forEach((element) => {
                    if (element.attribute("name") == mRelationship.arrival_country) {
                      element.attribute("total", mRelationship.getStatus()); // change the degree of openness of the country
                      element.attribute("info", mRelationship.info);
                      element.applySettings({});
                  }
                })
                }



              })
            }
          )

      })
    });
  }

  helloWorld() {
    alert('Hello world!');
  }

  customizeLayers(elements) {
    elements.forEach((element) => {
      let country:String = element.attribute("name");
      if (country == this.currentCountry) {

      } else {
        element.attribute('total', 5);
      }
    })
  }

  customizeTooltip(arg) {
    let name = arg.attribute('name');
    let info = arg.attribute('info') || "No info";
    return { text: `${name}: ${info}`};
  }

  customizeText = (itemInfo) => {
    switch (itemInfo.index) {
      case 0:
        return 'you are here'
      case 1:
        return 'open'
      case 2:
        return 'open with restrictions'
      case 3:
        return 'closed'
      default:
        return 'unknown'
    }
  }


  /**
   * call if the country is qurantine meaning you can visit any other country
   */
  updateAllCountries(openness:number) {
    this.VectorMap.instance.getLayers()[0].getElements().forEach((element) => {
      element.attribute("total", openness); // change the degree of openness of the country
      element.applySettings({});
    })
  }

  updateCountry(country:string, openness:number) {
    // update currentCountry color
    this.VectorMap.instance.getLayers()[0].getElements().forEach((element) => {
      if (element.attribute("name") == country) {
        element.attribute("total", openness); // change the degree of openness of the country
        element.applySettings({});
      }
    })
  }

  updateCountries(countries: string[], openness: number) {
    this.VectorMap.instance.getLayers()[0].getElements().forEach((element) => {
      if (element.attribute("name") in countries) {
        element.attribute("total", openness); // change the degree of openness of the country
        element.applySettings({});
      }
    })
  }
}

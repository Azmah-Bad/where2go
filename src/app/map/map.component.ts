import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DxVectorMapComponent } from 'devextreme-angular';
import { LocationService } from '../services/location.service';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { CountryService } from "../services/country.service";
import { Countries, Country } from '../interfaces/country';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Relationship } from '../interfaces/relationship';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

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
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.customizeLayers = this.customizeLayers.bind(this);
  }


  ngOnInit(): void {

    if (this.route.snapshot.paramMap.has('country')) {
      // the country is in the route
      this.currentCountry = this.route.snapshot.paramMap.get('country');
    } else {
      this.locationService.getPosition().pipe(
        switchMap((position) => {
          return this.locationService.getCountry(position)
        })
        // ,
        // catchError((err) => {
        //   console.error(err);
        //   return of('shit')
        // })
      ).subscribe(resp => {
        this.VectorMap.instance.hideLoadingIndicator();
        // found the currentCountry
        this.currentCountry = resp.countryName;

        this.location.go("/" + this.currentCountry);
        this.updateMap();
      })
    }


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

  updateMap() {
    if (this.currentCountry == undefined) {
      return // so it does nothing when the
    }
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

            if (mRelationship.arrival_country == '*') {
              this.updateAllCountries(mRelationship);
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
  }

  /**
   * call if the country is qurantine meaning you can visit any other country
   */
  updateAllCountries(relationship: Relationship) {
    let openness = relationship.getStatus();
    relationship.translateDepartureCountry();
    this.VectorMap.instance.getLayers()[0].getElements().forEach((element) => {
      if (element.attribute('name') != relationship.departure_country) {
        element.attribute("total", openness); // change the degree of openness of the country
        element.attribute("info", relationship.info);
        element.applySettings({});
      }
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

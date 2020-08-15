import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DxVectorMapComponent } from 'devextreme-angular';
import { LocationService } from '../location.service';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { CountryService } from "../country.service";
import { Countries, Country } from '../country';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  worldMap: any = mapsData.world;
  countries: Countries;
  currentCountry: string;

  @ViewChild("theVectorMap", {static: false}) VectorMap: DxVectorMapComponent;

  constructor(
    private locationService: LocationService,
    private countryService: CountryService,
  ) {
    this.customizeLayers = this.customizeLayers.bind(this);
  }


  ngOnInit(): void {
    this.countries = this.countryService.getCountries();
    this.locationService.getPosition().subscribe((position) => {
      this.locationService.getCountry(position).subscribe((resp) => {
        this.currentCountry = resp.countryName;
        this.VectorMap.instance.getLayers()[0].getElements().forEach((element) => {
          if (element.attribute("name") == this.currentCountry) {
            element.attribute("total", 0); // change the degree of openness of the country
            element.applySettings({});

          }
        })


      })
    });
  }

  helloWorld() {
    alert('Hello world!');
  }

  customizeLayers(elements) {
    elements.forEach((element) => {
      let country:String = element.attribute("name");
      let countryOpeness = (Math.random() * 3) + 1; // TODO :: get data from server
      if (country == this.currentCountry) {

      } else {
        element.attribute('total', countryOpeness || 0);
      }


      // if (country) {
      //   element.attribute('total', country.openness);
      // } else {
      //   element.attribute('total', countryOpeness || 0);
      // }

    })
  }

  customizeTooltip(arg) {
    let name = arg.attribute('name');
    return { text: `deg of openness of ${name}` };
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
}

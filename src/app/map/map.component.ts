import { Component, OnInit } from '@angular/core';
import { DxVectorMapComponent } from 'devextreme-angular';
import { LocationService } from '../location.service';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  worldMap: any = mapsData.world;

  constructor(private locationService: LocationService) {}
  currentCountry: String;

  ngOnInit(): void {
    this.locationService.getPosition().subscribe((position) => {
      this.locationService.getCountry(position).subscribe((resp) => {
        this.currentCountry = resp.countryName
      })
    });
  }

  helloWorld() {
    alert('Hello world!');
  }

  customizeLayers(elements) {
    elements.forEach((element) => {
      let countryOpeness = Math.random() * 4; // TODO :: get data from server
      element.attribute('total', countryOpeness || 0);
    });
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
        return ''
    }
  }
}

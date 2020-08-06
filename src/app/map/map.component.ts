import { Component, OnInit } from '@angular/core';
import { DxVectorMapComponent } from "devextreme-angular";

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  worldMap: any = mapsData.world;

  constructor() { }

  ngOnInit(): void {
  }

  helloWorld() {
    alert('Hello world!');
  }

  customizeLayers(elements) {
    elements.forEach((element) => {
        let countryGDPData = Math.random() * 4
        element.attribute("total", countryGDPData|| 0);
    });
}


}

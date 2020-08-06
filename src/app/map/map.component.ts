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
        let countryOpeness = Math.random() * 4 // TODO :: get data from server
        element.attribute("total", countryOpeness|| 0);
    });
  }

  customizeTooltip (arg) {
    let name = arg.attribute("name");
    return {text: `deg of openness of ${name}`}
  }

  customizeText = (arg) => ("degree of openness"); // yeah i know thats not a word // todo :: get a proper label


}

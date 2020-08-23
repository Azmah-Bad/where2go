import { Component, OnInit, ViewChild } from '@angular/core';
import { ManageService } from '../services/manage.service';

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { DxVectorMapComponent } from 'devextreme-angular';

import { Relationship } from '../interfaces/relationship';
import { MapLayerElement } from 'devextreme/viz/vector_map';

@Component({
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  worldMap: any = mapsData.world;
  INSTRCUTIONS = [
    'select departure country',
    'select open countries',
    'select open countries with restricitions',
    'select closed countries',
    'confirm',
  ];

  stage = 0; // keeps track of the stage of the inputs
  stageInstruction = this.INSTRCUTIONS[this.stage];

  departureCountry: string; // at stage 0 manager select the departure country and it gets stored here
  relationships: Relationship[] = []; // all the new relationships that the manager created

  @ViewChild('theVectorMap', { static: false }) VectorMap: DxVectorMapComponent;
  MapElements: MapLayerElement[];

  constructor(private manger: ManageService) {
    this.customizeLayers = this.customizeLayers.bind(this);
  }

  ngOnInit(): void {
    this.checkIsLoggedIn();
  }

  test() {
    this.manger.test().subscribe();
  }

  /**
   * the click on the map callback
   */
  click(e) {
    try {
      let selectedCountry = e.target.attribute('name');
      if (this.stage == 0) {
        // first stage set the departure country
        this.departureCountry = selectedCountry;
        this.updateCountry(selectedCountry, '0');
        this.moveToNextStage(); // authomatically moves to the next stage 
      } else { // other stages set the arriavl countries
        let relationship = new Relationship({ // create the relationship
          departure_country: this.departureCountry,
          arrival_country: selectedCountry,
          status: this.stage.toString(),
          info: 'no info',
        });
        this.relationships.push(relationship); // save it

        this.updateCountry(selectedCountry, this.stage.toString()); // feedback in the map
      }
    } catch (TypeError) {
      console.log('select a country');
    }
  }

  /**
   * update a country's status on the map
   */
  updateCountry(country: string, status: string) {
    this.MapElements.forEach((element) => {
      if (element.attribute('name') == country) {
        element.attribute('total', status); // change the degree of openness of the country
        element.applySettings({});
      }
    });
  }

  moveToNextStage() {
    if (this.stage == 4) {
      // final stage
      this.stage = 0;
    } else {
      this.stage++;
      this.stageInstruction = this.INSTRCUTIONS[this.stage]; // update the stage instructions
    }
  }

  /**
   * wrap up all the data in relationships and send it to backend
   */
  submit() {}

  // map methods
  customizeLayers(elements) {
    elements.forEach((element) => {
      let country: String = element.attribute('name');
    });
  }

  customizeTooltip(arg) {
    let name = arg.attribute('name');
    let info = arg.attribute('info') || 'No info';
    return { text: `${name}: ${info}` };
  }

  customizeText = (itemInfo) => {
    switch (itemInfo.index) {
      case 0:
        return 'you are here';
      case 1:
        return 'open';
      case 2:
        return 'open with restrictions';
      case 3:
        return 'closed';
      default:
        return 'unknown';
    }
  };

  onDrawn() {
    this.MapElements = this.VectorMap.instance.getLayerByIndex(0).getElements();
  }

  /*
  if user isn't logged in redirect him to login page
  */
  checkIsLoggedIn() {
    // todo
  }
}

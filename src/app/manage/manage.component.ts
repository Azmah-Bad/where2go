import { Component, OnInit, ViewChild } from '@angular/core';
import { ManageService } from '../services/manage.service';

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { DxVectorMapComponent } from 'devextreme-angular';

import { Relationship } from '../interfaces/relationship';
import { MapLayerElement } from 'devextreme/viz/vector_map';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, tap, buffer } from 'rxjs/operators';

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
  lastSelectedCountry: string = '';
  bufferInfo: string = '';
  relationships: Relationship[] = []; // all the new relationships that the manager created
  toBeDeletedRelationships: Relationship[] = []; // all the relationships that the user wants to delete

  @ViewChild('theVectorMap', { static: false }) VectorMap: DxVectorMapComponent;
  MapElements: MapLayerElement[];

  constructor(
    private manager: ManageService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.customizeLayers = this.customizeLayers.bind(this);
  }

  ngOnInit(): void {
    this.checkIsLoggedIn();
  }

  test() {
    this.manager.test().subscribe();
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
        this.fillInMap();
        this.moveToNextStage(); // automatically moves to the next stage
      } else {
        if (e.target.attribute('total') == undefined) {
          // blank country
          // other stages set the arriavl countries
          let relationship = new Relationship({
            // create the relationship
            departure_country: this.departureCountry,
            arrival_country: selectedCountry,
            status: this.stage.toString(),
            info: 'no info',
          });
          this.relationships.push(relationship); // save it
          this.lastSelectedCountry = relationship.arrival_country;

          this.updateCountry(selectedCountry, this.stage.toString()); // feedback in the map
        } else {
          // a country that already have a status and the manager wants to delete
          // add to the toBeDeleted Relationships
          this.toBeDeletedRelationships.push(
            new Relationship({
              // create the relationship
              departure_country: this.departureCountry,
              arrival_country: selectedCountry,
              status: e.target.attribute('total'),
              info: e.target.attribute('info'),
            })
          );

          this.updateCountry(selectedCountry, '5');
        }
      }
    } catch (TypeError) {
      console.log('select a country');
    }
  }

  /**
   * update a country's status on the map
   */
  updateCountry(country: string, status: string, info?: string) {
    this.MapElements.forEach((element) => {
      if (element.attribute('name') == country) {
        element.attribute('total', status); // change the degree of openness of the country
        if (info !== undefined) {
          element.attribute('info', info);
        }
        element.applySettings({});
      }
    });
  }

  updateCountries(relationships: Relationship[]) {
    for (let relationship of relationships) {
      this.updateCountry(relationship.arrival_country, relationship.status);
    }
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
   * after user select departure country fills in the map from server
   */
  fillInMap() {
    this.manager
      .getRelationship(this.departureCountry)
      .pipe(
        map(this.dictionaryToRelationships),
        tap((relationships) => {
          relationships.forEach((relationship) => {
            relationship.toCountryNames();
            this.updateCountry(
              relationship.arrival_country,
              relationship.status
            );
          });
        })
      )
      .subscribe();
  }

  dictionaryToRelationships(dictionaries: any): Relationship[] {
    let relationships: Relationship[] = [];
    dictionaries.forEach((dictionary: any) => {
      relationships.push(new Relationship(dictionary));
    });
    return relationships;
  }

  /**
   * wrap up all the data in relationships and send it to backend
   */
  submit() {
    let isSuceessful = true;
    this.relationships.forEach((relationship) => {
      this.manager.submit(relationship).subscribe((resp) => {
        isSuceessful = isSuceessful || resp;
      });
    });
    this.toBeDeletedRelationships.forEach((relationship) => {
      this.manager.delete(relationship).subscribe();
    });
    if (isSuceessful) {
      this._snackBar.open('change saved 🎉', 'dismiss');
    } else {
      this._snackBar.open(
        'an error has occured, blame the shitty dev 💩',
        'dismiss'
      );
    }
  }

  restart() {
    this.toBeDeletedRelationships = [];
    this.departureCountry = '';
    this.lastSelectedCountry = '';
    this.stage = 0;
    this.stageInstruction = this.INSTRCUTIONS[this.stage];
    this.MapElements.forEach((element) => {
      element.attribute('total', '5');
      element.applySettings({});
    });
  }

  saveInfo() {
    this.relationships[this.relationships.length - 1].info = this.bufferInfo;
    this.bufferInfo = '';
    this._snackBar.open('info saved 🎉', 'dismiss');
  }
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
    if (!this.manager.isLoggedIn()) {
      this._snackBar.open('you are not logged in', 'dismiss');
      this.router.navigate(['login/']);
    }
  }
}

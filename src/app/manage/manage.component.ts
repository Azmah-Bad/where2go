import { Component, OnInit, ViewChild } from '@angular/core';
import { ManageService } from '../services/manage.service';

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { DxVectorMapComponent } from 'devextreme-angular';

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
  ];
  stage = 0;
  stageInstruction = this.INSTRCUTIONS[this.stage];

  constructor(private manger: ManageService) {
    this.customizeLayers = this.customizeLayers.bind(this);
  }

  ngOnInit(): void {
    this.checkIsLoggedIn();
  }

  test() {
    this.manger.test().subscribe();
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

  /*
  if user isn't logged in redirect him to login page
  */
  checkIsLoggedIn() {
    // todo
  }
}

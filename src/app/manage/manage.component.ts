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

  @ViewChild('theVectorMap', { static: false }) VectorMap: DxVectorMapComponent;

  constructor(private manger: ManageService) {}

  ngOnInit(): void {
    this.checkIsLoggedIn();
  }

  test() {
    this.manger.test().subscribe();
  }

  /*
  if user isn't logged in redirect him to login page
  */
  checkIsLoggedIn() {
    // todo 
  }
}

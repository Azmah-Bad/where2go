import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { DxVectorMapComponent } from 'devextreme-angular';
import { LocationService } from '../services/location.service';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { CountryService } from '../services/country.service';
import { Countries, Country } from '../interfaces/country';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Relationship } from '../interfaces/relationship';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { GeoNames } from '../interfaces/geo-names';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { countryList } from '../../assets/counries';
import { Map } from '../interfaces/map';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  worldMap: any = mapsData.world;
  currentCountry: string;
  Map: Map;

  @ViewChild('theVectorMap', { static: false }) VectorMap: DxVectorMapComponent;

  constructor(
    private locationService: LocationService,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) {
    this.customizeLayers = this.customizeLayers.bind(this);
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.has('country')) {
      // the country is in the route
      this.currentCountry = this.route.snapshot.paramMap.get('country');
    } else {
      this.locationService
        .getPosition()
        .pipe(
          switchMap((position) => {
            return this.locationService.getCountry(position);
          }),
          map((geoName) => geoName.countryName),
          catchError((err) => {
            console.error(err);
            // alert("couldn't find the name of your country");
            this.dialog.open(DialogOverview);
            return this.currentCountry;
          }),
          tap((countryName) => {
            this.VectorMap.instance.hideLoadingIndicator();
            // found the currentCountry
            this.currentCountry = countryName;

            this.location.go('/' + this.currentCountry);
            this.updateMap();
          })
        )
        .subscribe();
    }
  }

  helloWorld() {
    alert('Hello world!');
  }

  customizeLayers(elements) {
    elements.forEach((element) => {
      let country: String = element.attribute('name');
      if (country == this.currentCountry) {
      } else {
        element.attribute('total', 5);
      }
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

  updateMap() {
    this.Map = new Map(this.VectorMap);
    if (this.currentCountry == undefined) {
      return; // so it does nothing when the
    }
    // update currentCountry color
    this.Map.setCountryStatus(this.currentCountry, 0);

    // get other countries status
    this.countryService
      .getRelationships(this.currentCountry)
      .pipe(
        map(
          // making result a list of Relationships
          (queryResults) => {
            let relationships: Relationship[] = [];
            queryResults.forEach((queryResult) => {
              relationships.push(new Relationship(queryResult.fields));
            });
            return relationships;
          }
        ),
        catchError((_) => {
          return of<Relationship[]>([]);
        }),
        tap((relationships) => {
          relationships.forEach((relationship) => {
            if (relationship.arrival_country == '*') {
              // all countries should be updated
              this.Map.setAllCountries(
                relationship.getStatus(),
                this.currentCountry
              );
            } else {
              relationship.toCountryNames();
              this.Map.setCountryStatus(
                relationship.arrival_country,
                relationship.getStatus(),
                relationship.info
              );
            }
          });
        })
      )
      .subscribe();
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '250px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.currentCountry = result;
      this.location.go('/' + this.currentCountry);
      this.Map.resetMap();
      this.updateMap();
    });
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.html',
  styleUrls: ['./dialog.scss'],
})
export class DialogOverview {
  selected: string;
  countries = countryList;

  constructor(public dialogRef: MatDialogRef<DialogOverview>) {}

  onNoClick(): void {
    // this.dialogRef.close();
  }
}

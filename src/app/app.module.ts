import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent, DialogOverview } from './map/map.component';
import { DxButtonModule, DxVectorMapModule } from 'devextreme-angular';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DialogOverview
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxButtonModule,
    DxVectorMapModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSelectModule
  ],
  // exports:
  //   [MatDialogModule,
  //     MatInputModule,
  //     MatButtonModule,
  //     BrowserAnimationsModule
  //   ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

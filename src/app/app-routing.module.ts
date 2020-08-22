import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'login', component: LoginComponent },
  { path: 'manage', component: ManageComponent },
  { path: ':country', component: MapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

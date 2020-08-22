import { Component, OnInit } from '@angular/core';
import { ManageService } from "../services/manage.service";

@Component({
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  constructor(
    private manger:ManageService,
  ) { }

  ngOnInit(): void {
  }

  test() {
    this.manger.test().subscribe()
  }

}

import { Component, OnInit } from '@angular/core';
import { AlertService } from "src/app/_services/alert.service";

@Component({
  selector: 'app-admin-base',
  templateUrl: './admin-base.component.html',
  styleUrls: ['./admin-base.component.css']
})
export class AdminBaseComponent implements OnInit {

  constructor(private alertService: AlertService) { }

  ngOnInit() {
  }

}

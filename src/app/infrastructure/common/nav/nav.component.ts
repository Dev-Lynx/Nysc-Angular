import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from "src/app/_services/alert.service";
import {AuthService} from "../../../_services/auth.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  get isHQ() {
    return this.auth.role !== "RegularUser";
  }

  constructor(private auth: AuthService, 
    public alertService: AlertService) { }

  ngOnInit() {
  }

  async logout() {
    await this.auth.logout();
  }
}

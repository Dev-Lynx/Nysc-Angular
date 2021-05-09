import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from "src/app/_services/account.service";
import { AuthService } from "src/app/_services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() busy = false;
  @Input() busyMessage = "";
  
  get isHQ() {
    return this.auth.role !== "RegularUser";
  }

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

}

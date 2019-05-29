import { Component, OnInit } from '@angular/core';
import {UIService} from "../../_services/ui.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  UI: UIService;

  constructor(ui: UIService) { this.UI = ui; }

  ngOnInit() {
  }

}

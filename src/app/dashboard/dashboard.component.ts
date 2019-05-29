import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  alertService: AlertService;

  constructor(private alert: AlertService) { this.alertService = alert; }

  ngOnInit() {
  }

  async ngAfterViewInit() {
  }

}

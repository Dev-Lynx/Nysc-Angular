import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Route, Router } from "@angular/router";
import { ClrDatagridStateInterface } from "@clr/angular";
import { IPagedResult, SieveModel } from "src/app/_models/misc";
import { User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";
import { AlertService } from "src/app/_services/alert.service";


@Component({
  selector: 'app-hq-dashboard',
  templateUrl: './hq-dashboard.component.html',
  styleUrls: ['./hq-dashboard.component.css']
})
export class HqDashboardComponent implements OnInit {
  busy = false;
  packageDialogActive = false;
  model: SieveModel = {
    pageSize: 20,
    page: 1
  };
  
  queryComplete = false;

  

  get identities() {
    return this.account.identities || {} as IPagedResult<User>;
  }

  constructor(protected account: AccountService, 
    private alertService: AlertService,
    private router: Router) { 
    // router.events.subscribe((x) => {
    //   console.log(this, x);
    // });
  }

  ngOnInit() {
    // console.log("Querying identities", this.uploadEl);
    this.queryIdentities();
  }

  queryIdentities() {
    this.busy = true;
    this.queryComplete = false;
    this.account.queryIdentities(this.model).toPromise()
      .then(x => {
        this.busy = false;
        this.queryComplete = true;
        console.log("Done Querying...", this.identities.currentPage, this.identities.pageSize, this.identities.rowCount);
      }).catch(err => {
        this.alertService.error("A critical error occurred while acquiring data from the server");
      });
  }

  handlePaginationChanged(e: ClrDatagridStateInterface<User>) {
    if (this.model.pageSize == e.page.size && this.model.page == e.page.current) {
      return;
    }
    
    this.model.page = e.page.current;
    this.model.pageSize = e.page.size;

    if (this.queryComplete) {
      this.queryComplete = false;
      this.queryIdentities();
    }

    console.log("Pagination changed", e);
  }

  // handleFileUpload() {
  //   this.uploadEl.nativeElement.click();
  // }

  // handleFileSelected(e: any) {
  //   const el = this.uploadEl.nativeElement;
  //   this.files = el.files;
  // }

}

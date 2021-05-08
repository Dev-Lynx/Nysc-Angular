import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ClrLoadingState, ClrRadio } from "@clr/angular";
import { EventEmitter } from '@angular/core';
import { PackageAuthViewModel } from "src/app/_models/misc";
import { DataPackageViewModel } from "src/app/_models/package";
import { AccountService } from "src/app/_services/account.service";
import { AlertService } from "src/app/_services/alert.service";
import HtmlMagic from "src/app/_util/html-magic";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-hq-package-dialog',
  templateUrl: './hq-package-dialog.component.html',
  styleUrls: ['./hq-package-dialog.component.css']
})
export class HqPackageDialogComponent implements OnInit {
  form = this.fb.group({
    username: ['', Validators.compose([Validators.required])],
    password: ['', Validators.compose([Validators.required])],
  });

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  @Input()
  active: boolean;
  files: FileList;
  uploading = false;
  doneUploading = false;

  progress = 0;

  busy = false;

  model = {
    username: "",
    password: ""
  };

  get loadingStats() {
    return this.busy ? ClrLoadingState.LOADING : ClrLoadingState.DEFAULT;
  }

  get currentFile() {
    if (!this.files || this.files.length <= 0) {
      return null;
    }

    return this.files.item(this.files.length - 1);
  }

  @ViewChild('uploadFile')
  uploadEl: ElementRef<HTMLInputElement>;

  @Output()
  done = new EventEmitter();

  currentPackage: DataPackageViewModel|null = null;

  get mode() {
    // console.log(this.currentFile, this.currentPackage, this.uploading, !this.currentFile && !this.currentPackage);

    if (!this.currentFile && !this.currentPackage) {
      return 1;
    } else if (this.uploading) {
      return 2;
    } else {
      return 3;
    }
  }

  constructor(private fb: FormBuilder, private account: AccountService, 
              private alert: AlertService) {}

  ngOnInit() {
  }

  handleFileUpload() {
    this.uploadEl.nativeElement.click();
  }

  handleFileSelected(e: any) {
    this.files = this.uploadEl.nativeElement.files;

    const formData = new FormData();
    formData.append("package", this.files[0]);

    this.uploading = true;
    this.account.uploadPackage(formData)
      .pipe(map((ev: HttpEvent<DataPackageViewModel>) => {
        if (ev.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * ev.loaded / ev.total);
          console.log(this.progress)
          return { status: 'progress', message: this.progress };
        } else if (ev.type === HttpEventType.Response) {
          this.currentPackage = ev.body;
          this.doneUploading = true;
          console.log("Done Uploading");
        }
      })).toPromise().finally(() => this.uploading = false);
      // .then(ev => {
      //   if (ev.type === HttpEventType.UploadProgress) {
      //     this.progress = Math.round(100 * ev.loaded / ev.total);
      //     console.log(this.progress)
      //     return { status: 'progress', message: this.progress };
      //   } else if (ev.type === HttpEventType.Response) {
      //     this.currentPackage = ev.body;
      //     this.doneUploading = true;
      //     console.log("Done Uploading");
      //   }
      // }).catch(err => {
      //   this.alert.error(err.error);
      //   console.log(err);
      //   this.handleGoBack();
      // }).finally(() => {
      //   this.uploading = false;
      // })
  }

  handleClose(done?: boolean) {
    this.active = false;
    if (done) {
      this.done.emit();
    }
  }

  handleGoBack(e?: MouseEvent) {
    if (e) {
      if (e.clientX == 0 && e.clientY == 0 && e.offsetX == 0 && e.offsetY == 0) {
        return;
      } else {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    console.log("Going back", this.files);

    const el = this.uploadEl.nativeElement;
    HtmlMagic.clearFileInput(el);

    this.files = el.files;
    this.uploading = false;
    this.doneUploading = false;
    this.currentPackage = null;

    console.log("Went back", this.files);
  }

  handleImport(e: any) {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }

    this.busy = true;

    const payload: PackageAuthViewModel = {
      ...this.form.value,
      id: this.currentPackage.id
    }
    

    this.account.unlockPackage(payload).toPromise()
      .then(() => {
        this.alert.success("Package imported successfully!");
        this.handleClose(true);
      }).catch(err => {
        console.error("Error is ", err);
        this.alert.error(err.error);
      }).finally(() => this.busy = false);
  }
}

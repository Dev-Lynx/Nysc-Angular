import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../_services/auth.service';

import {Photo} from '../../_models/photo';
import {AlertService} from '../../_services/alert.service';

@Component({
  selector: 'app-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.css']
})
export class ImageControlComponent implements OnInit, AfterViewInit {
  //#region Inputs
  @Input() uploadLabel: string;
  @Input() controlLabel: string;
  @Input() imageSource: string;
  @Input() imageDescription = 'Image';
  @Input() height: number = 128;
  @Input() uploadRoute: string;
  //#endregion

  baseUrl = environment.apiBase + 'photos/';
  uploader: FileUploader = new FileUploader({url: this.baseUrl});
  hasBaseDropZoneOver = false;

  get uploadUrl() {
    return this.baseUrl + this.uploadRoute;
  }

  constructor(private auth: AuthService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.configureUploadOptions();
  }

  ngAfterViewInit(): void {
    // Get all the progress bars in the document
    const bars: any = document.querySelectorAll('.responsive svg');

    // Give them a padding of .3rem
    for (const bar of bars) {
      bar.style.padding = '.3rem';
    }

  }
  fileOverBase(e: any): void {
    if (this.uploader.isUploading) {
      if (this.hasBaseDropZoneOver) {
        this.hasBaseDropZoneOver = false;
      }
      return;
    }
    if (e === this.hasBaseDropZoneOver) { return; }
    this.hasBaseDropZoneOver = e;
  }

  fileSelected(e: FileList): void {
    if (this.uploader.isUploading) { return; }

    const fileArray: File[] = [];
    for (let i = 0; i < e.length; i++) {
      const file = e.item(i);
      if (file.size > this.uploader.options.maxFileSize) {
        this.alertService.warning(
          'The selected image is too large to be uploaded. ' +
          'Only upload images within the upload limit.', '', true, 5000);
        continue;
      }
      fileArray.push(file);
    }

    this.uploader.response.subscribe(response => {
      let photo: Photo;
      console.log(response);
      photo = JSON.parse(response) as Photo;
      this.imageSource = photo.url;
      this.alertService.success(this.imageDescription +
        ' upload was successful', '', true, 5000);
    }, error => {
      console.log(error);
      this.alertService.error('An error occurred during an image upload. Please try again later.'
        , '', true, 5000);
    }, () => {
      this.uploader.response.unsubscribe();
    });

    this.uploader.addToQueue(fileArray);

    for (const item of this.uploader.queue) {
      item.withCredentials = false;
    }

    this.uploader.uploadAll();
  }

  configureUploadOptions() {
    this.uploader.setOptions({
      url: this.uploadUrl,
      authToken: 'Bearer ' + this.auth.getToken(),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      maxFileSize: 2 * 1024 * 1024,
      // headers: uploadHeaders
  });
  }
}

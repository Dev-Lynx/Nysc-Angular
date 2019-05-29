import {Injectable, HostListener, OnInit, AfterViewInit} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UIService implements OnInit, AfterViewInit{
  busy: boolean;
  busyMessage = 'Loading...';
  screenWidth: any;
  screenHeight: any;

  constructor() { }

  ngOnInit(): void {
    this.onResize();
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log(this.screenHeight, this.screenWidth);
  }
}


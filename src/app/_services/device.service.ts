import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

// #region Abstractions
export class DeviceContext {
  size?: ScreenSize;
  device: DeviceType;
  landscape: boolean;
}

export type DeviceType = "mobile" | "desktop" | "tablet";
export type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeBreakPoints = [Breakpoints.XSmall, Breakpoints.Small,
  Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge];

// const screenSizes = [SCREEN_SIZE.XS, SCREEN_SIZE.SM, SCREEN_SIZE.MD,
//   SCREEN_SIZE.LG, SCREEN_SIZE.XL];
const screenSizes: ScreenSize[] = ["xs", "sm", "md", "lg", "xl"];
// #endregion


/*
Original Source: https://stackoverflow.com/a/59844278/8058709
Special thanks to the author Denis (https://stackoverflow.com/users/12755521/denis)
*/
@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private context: DeviceContext;

  get size() {
    return this.context.size;
  }

  get device() {
    return this.context.device;
  }

  get dmb() {
    return this.context.device === "mobile";
  }

  get ddt() {
    return this.context.device === "desktop";
  }

  get dtb() {
    return this.context.device === "tablet";
  }

  get xs() {
    return this.context.size === "xs";
  }

  get sm() {
    return this.context.size === "sm";
  }

  get md() {
    return this.context.size === "md";
  }

  get lg() {
    return this.context.size === "lg";
  }

  get xl() {
    return this.context.size === "xl";
  }

  private _unsubscriber$: Subject<any> = new Subject();
  public screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);
  public mediaBreakpoint$: BehaviorSubject<string> = new BehaviorSubject(null);

  // get mobile(): boolean { return this.detector.isMobile(); }
  // get tablet(): boolean { return this.detector.isTablet(); }
  // get desktop(): boolean { return this.detector.isDesktop(); }
  
  constructor(private observer: BreakpointObserver) {
    this.init();
  }


  init() {
    this._setScreenWidth(window.innerWidth);
    this._setMediaBreakpoint(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(1000),
        takeUntil(this._unsubscriber$)
      ).subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);
        this._setMediaBreakpoint(evt.target.innerWidth);
      });

      this.observer.observe([Breakpoints.Web, Breakpoints.Handset, Breakpoints.Tablet])
        .subscribe((state: BreakpointState) => {
          if (this.observer.isMatched(Breakpoints.Handset)) {
            this.context = {
              device: "mobile",
              landscape: this.observer.isMatched(Breakpoints.HandsetLandscape)
            };
          } else if (this.observer.isMatched(Breakpoints.Tablet)) {
            this.context = {
              device: "tablet",
              landscape: this.observer.isMatched(Breakpoints.TabletLandscape)
            };
          } else if (this.observer.isMatched(Breakpoints.Web)) {
            this.context = {
              device: "desktop",
              landscape: this.observer.isMatched(Breakpoints.WebLandscape)
            };
          }
  
          for (let i = sizeBreakPoints.length - 1; i >= 0; i--) {
            if (this.observer.isMatched(sizeBreakPoints[i])) {
              this.context.size = screenSizes[i];
              break;
            }
          }
        });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
  }

  private _setMediaBreakpoint(width: number): void {
    if (width < 576) {
      this.mediaBreakpoint$.next('xs');
    } else if (width >= 576 && width < 768) {
      this.mediaBreakpoint$.next('sm');
    } else if (width >= 768 && width < 992) {
      this.mediaBreakpoint$.next('md');
    } else if (width >= 992 && width < 1200) {
      this.mediaBreakpoint$.next('lg');
    } else if (width >= 1200 && width < 1600) {
      this.mediaBreakpoint$.next('xl');
    } else {
      this.mediaBreakpoint$.next('xxl');
    }
  }
}

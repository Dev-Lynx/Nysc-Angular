import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';


/*
Original Source: https://stackoverflow.com/a/59844278/8058709
Special thanks to the author Denis (https://stackoverflow.com/users/12755521/denis)
and of course the author of ngx-device-detector
*/
@Injectable({
  providedIn: 'root'
})
export class DeviceService extends DeviceDetectorService {
  private _unsubscriber$: Subject<any> = new Subject();
  public screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);
  public mediaBreakpoint$: BehaviorSubject<string> = new BehaviorSubject(null);
  
  constructor(@Inject(PLATFORM_ID) platformId: any) {
    super(platformId);
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

import { Injectable } from '@angular/core';

export interface AppLevelAlert {
  type: 'info' | 'warning' | 'success' | 'danger';
  text: string;
  action: string;
  closable: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AlertService {
  alerts: AppLevelAlert[] = [];

  constructor() { }

  success(message: string, action: string = '', closable: boolean = false, lifeSpan: number = 10000) {
    const alert: AppLevelAlert = {
      type: 'success',
      text: message,
      closable,
      action
    };
    this.alerts.push(alert);
    this.configureLifeSpan(alert, lifeSpan);
  }

  info(message: string, action: string = '', closable: boolean = false, lifeSpan: number = 10000) {
    const alert: AppLevelAlert = {
      type: 'info',
      text: message,
      closable,
      action
    };
    this.alerts.push(alert);
    this.configureLifeSpan(alert, lifeSpan);
  }

  warning(message: string, action: string = '', closable: boolean = false, lifeSpan: number = 10000) {
    const alert: AppLevelAlert = {
      type: 'warning',
      text: message,
      closable,
      action
    };
    this.alerts.push(alert);
    this.configureLifeSpan(alert, lifeSpan);
  }

  error(message: string, action: string = '', closable: boolean = false, lifeSpan: number = 10000) {
    const alert: AppLevelAlert = {
      type: 'danger',
      text: message,
      closable,
      action
    };
    this.alerts.push(alert);
    this.configureLifeSpan(alert, lifeSpan);
  }

  configureLifeSpan(alert: AppLevelAlert, timeout: number) {
    setTimeout(() => {
      const index = this.alerts.indexOf(alert);
      this.alerts.splice(index, 1);
    }, timeout);
  }
}

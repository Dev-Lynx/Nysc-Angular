import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HqDashboardComponent } from './hq-dashboard.component';

describe('HqDashboardComponent', () => {
  let component: HqDashboardComponent;
  let fixture: ComponentFixture<HqDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HqDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HqDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

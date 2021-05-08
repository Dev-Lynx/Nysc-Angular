import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HqPackageDialogComponent } from './hq-package-dialog.component';

describe('HqPackageDialogComponent', () => {
  let component: HqPackageDialogComponent;
  let fixture: ComponentFixture<HqPackageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HqPackageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HqPackageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

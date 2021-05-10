import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageControlComponent } from './image-control.component';

describe('ImageControlComponent', () => {
  let component: ImageControlComponent;
  let fixture: ComponentFixture<ImageControlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedAuthSnackBarComponent } from './failed-auth-snack-bar.component';

describe('FailedAuthSnackBarComponent', () => {
  let component: FailedAuthSnackBarComponent;
  let fixture: ComponentFixture<FailedAuthSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedAuthSnackBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedAuthSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

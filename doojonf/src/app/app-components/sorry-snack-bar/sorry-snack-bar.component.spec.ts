import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SorrySnackBarComponent } from './sorry-snack-bar.component';

describe('SorrySnackBarComponent', () => {
  let component: SorrySnackBarComponent;
  let fixture: ComponentFixture<SorrySnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SorrySnackBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SorrySnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LCommonComponent } from './l-common.component';

describe('LCommonComponent', () => {
  let component: LCommonComponent;
  let fixture: ComponentFixture<LCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

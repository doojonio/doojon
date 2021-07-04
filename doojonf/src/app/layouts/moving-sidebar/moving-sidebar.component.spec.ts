import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingSidebarComponent } from './moving-sidebar.component';

describe('MovingSidebarComponent', () => {
  let component: MovingSidebarComponent;
  let fixture: ComponentFixture<MovingSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovingSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

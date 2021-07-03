import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPersonalChallengeComponent } from './new-personal-challenge.component';

describe('NewPersonalChallengeComponent', () => {
  let component: NewPersonalChallengeComponent;
  let fixture: ComponentFixture<NewPersonalChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPersonalChallengeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPersonalChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

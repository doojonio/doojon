import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeEditorComponent } from './challenge-editor.component';

describe('ChallengeEditorComponent', () => {
  let component: ChallengeEditorComponent;
  let fixture: ComponentFixture<ChallengeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

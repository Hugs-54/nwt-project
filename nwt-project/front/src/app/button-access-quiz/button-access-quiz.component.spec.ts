import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonAccessQuizComponent } from './button-access-quiz.component';

describe('ButtonAccessQuizComponent', () => {
  let component: ButtonAccessQuizComponent;
  let fixture: ComponentFixture<ButtonAccessQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonAccessQuizComponent]
    });
    fixture = TestBed.createComponent(ButtonAccessQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

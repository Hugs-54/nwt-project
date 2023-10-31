import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedQuizzesComponent } from './shared-quizzes.component';

describe('SharedQuizzesComponent', () => {
  let component: SharedQuizzesComponent;
  let fixture: ComponentFixture<SharedQuizzesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedQuizzesComponent]
    });
    fixture = TestBed.createComponent(SharedQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStatsComponent } from './show-stats.component';

describe('ShowStatsComponent', () => {
  let component: ShowStatsComponent;
  let fixture: ComponentFixture<ShowStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowStatsComponent]
    });
    fixture = TestBed.createComponent(ShowStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

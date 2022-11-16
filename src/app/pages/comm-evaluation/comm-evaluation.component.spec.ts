import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommEvaluationComponent } from './comm-evaluation.component';

describe('CommEvaluationComponent', () => {
  let component: CommEvaluationComponent;
  let fixture: ComponentFixture<CommEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionListFilterComponent } from './question-list-filter.component';

describe('QuestionListFilterComponent', () => {
  let component: QuestionListFilterComponent;
  let fixture: ComponentFixture<QuestionListFilterComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionListFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

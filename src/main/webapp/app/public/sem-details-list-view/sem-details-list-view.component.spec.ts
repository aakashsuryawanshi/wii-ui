import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemDetailsListViewComponent } from './sem-details-list-view.component';

describe('SemDetailsListViewComponent', () => {
  let component: SemDetailsListViewComponent;
  let fixture: ComponentFixture<SemDetailsListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SemDetailsListViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemDetailsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TagMetaDataDetailComponent } from './tag-meta-data-detail.component';

describe('Component Tests', () => {
  describe('TagMetaData Management Detail Component', () => {
    let comp: TagMetaDataDetailComponent;
    let fixture: ComponentFixture<TagMetaDataDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TagMetaDataDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ tagMetaData: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TagMetaDataDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TagMetaDataDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load tagMetaData on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.tagMetaData).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

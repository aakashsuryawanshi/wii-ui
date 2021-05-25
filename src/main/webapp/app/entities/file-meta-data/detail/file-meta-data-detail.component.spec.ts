import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FileMetaDataDetailComponent } from './file-meta-data-detail.component';

describe('Component Tests', () => {
  describe('FileMetaData Management Detail Component', () => {
    let comp: FileMetaDataDetailComponent;
    let fixture: ComponentFixture<FileMetaDataDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FileMetaDataDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ fileMetaData: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FileMetaDataDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FileMetaDataDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load fileMetaData on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fileMetaData).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

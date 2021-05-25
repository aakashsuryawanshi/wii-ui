import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FileDetailsDetailComponent } from './file-details-detail.component';

describe('Component Tests', () => {
  describe('FileDetails Management Detail Component', () => {
    let comp: FileDetailsDetailComponent;
    let fixture: ComponentFixture<FileDetailsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FileDetailsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ fileDetails: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FileDetailsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FileDetailsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load fileDetails on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fileDetails).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

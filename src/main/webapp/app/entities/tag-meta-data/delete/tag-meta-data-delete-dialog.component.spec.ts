jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TagMetaDataService } from '../service/tag-meta-data.service';

import { TagMetaDataDeleteDialogComponent } from './tag-meta-data-delete-dialog.component';

describe('Component Tests', () => {
  describe('TagMetaData Management Delete Component', () => {
    let comp: TagMetaDataDeleteDialogComponent;
    let fixture: ComponentFixture<TagMetaDataDeleteDialogComponent>;
    let service: TagMetaDataService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TagMetaDataDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(TagMetaDataDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TagMetaDataDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TagMetaDataService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});

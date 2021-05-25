jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FileMetaDataService } from '../service/file-meta-data.service';
import { IFileMetaData, FileMetaData } from '../file-meta-data.model';
import { IFileDetails } from 'app/entities/file-details/file-details.model';
import { FileDetailsService } from 'app/entities/file-details/service/file-details.service';

import { FileMetaDataUpdateComponent } from './file-meta-data-update.component';

describe('Component Tests', () => {
  describe('FileMetaData Management Update Component', () => {
    let comp: FileMetaDataUpdateComponent;
    let fixture: ComponentFixture<FileMetaDataUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fileMetaDataService: FileMetaDataService;
    let fileDetailsService: FileDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FileMetaDataUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FileMetaDataUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FileMetaDataUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fileMetaDataService = TestBed.inject(FileMetaDataService);
      fileDetailsService = TestBed.inject(FileDetailsService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call FileDetails query and add missing value', () => {
        const fileMetaData: IFileMetaData = { id: 456 };
        const fileDetails: IFileDetails = { id: 32722 };
        fileMetaData.fileDetails = fileDetails;

        const fileDetailsCollection: IFileDetails[] = [{ id: 366 }];
        spyOn(fileDetailsService, 'query').and.returnValue(of(new HttpResponse({ body: fileDetailsCollection })));
        const additionalFileDetails = [fileDetails];
        const expectedCollection: IFileDetails[] = [...additionalFileDetails, ...fileDetailsCollection];
        spyOn(fileDetailsService, 'addFileDetailsToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ fileMetaData });
        comp.ngOnInit();

        expect(fileDetailsService.query).toHaveBeenCalled();
        expect(fileDetailsService.addFileDetailsToCollectionIfMissing).toHaveBeenCalledWith(
          fileDetailsCollection,
          ...additionalFileDetails
        );
        expect(comp.fileDetailsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const fileMetaData: IFileMetaData = { id: 456 };
        const fileDetails: IFileDetails = { id: 16239 };
        fileMetaData.fileDetails = fileDetails;

        activatedRoute.data = of({ fileMetaData });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(fileMetaData));
        expect(comp.fileDetailsSharedCollection).toContain(fileDetails);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fileMetaData = { id: 123 };
        spyOn(fileMetaDataService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fileMetaData });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fileMetaData }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fileMetaDataService.update).toHaveBeenCalledWith(fileMetaData);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fileMetaData = new FileMetaData();
        spyOn(fileMetaDataService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fileMetaData });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fileMetaData }));
        saveSubject.complete();

        // THEN
        expect(fileMetaDataService.create).toHaveBeenCalledWith(fileMetaData);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fileMetaData = { id: 123 };
        spyOn(fileMetaDataService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fileMetaData });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fileMetaDataService.update).toHaveBeenCalledWith(fileMetaData);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackFileDetailsById', () => {
        it('Should return tracked FileDetails primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFileDetailsById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

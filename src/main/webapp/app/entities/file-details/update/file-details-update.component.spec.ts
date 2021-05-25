jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FileDetailsService } from '../service/file-details.service';
import { IFileDetails, FileDetails } from '../file-details.model';

import { FileDetailsUpdateComponent } from './file-details-update.component';

describe('Component Tests', () => {
  describe('FileDetails Management Update Component', () => {
    let comp: FileDetailsUpdateComponent;
    let fixture: ComponentFixture<FileDetailsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fileDetailsService: FileDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FileDetailsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FileDetailsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FileDetailsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fileDetailsService = TestBed.inject(FileDetailsService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const fileDetails: IFileDetails = { id: 456 };

        activatedRoute.data = of({ fileDetails });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(fileDetails));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fileDetails = { id: 123 };
        spyOn(fileDetailsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fileDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fileDetails }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fileDetailsService.update).toHaveBeenCalledWith(fileDetails);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fileDetails = new FileDetails();
        spyOn(fileDetailsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fileDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fileDetails }));
        saveSubject.complete();

        // THEN
        expect(fileDetailsService.create).toHaveBeenCalledWith(fileDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fileDetails = { id: 123 };
        spyOn(fileDetailsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fileDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fileDetailsService.update).toHaveBeenCalledWith(fileDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

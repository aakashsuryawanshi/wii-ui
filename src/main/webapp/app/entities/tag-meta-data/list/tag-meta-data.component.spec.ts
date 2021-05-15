import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TagMetaDataService } from '../service/tag-meta-data.service';

import { TagMetaDataComponent } from './tag-meta-data.component';

describe('Component Tests', () => {
  describe('TagMetaData Management Component', () => {
    let comp: TagMetaDataComponent;
    let fixture: ComponentFixture<TagMetaDataComponent>;
    let service: TagMetaDataService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TagMetaDataComponent],
      })
        .overrideTemplate(TagMetaDataComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TagMetaDataComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TagMetaDataService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.tagMetaData?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

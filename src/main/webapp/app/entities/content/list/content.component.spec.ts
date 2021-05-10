import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ContentService } from '../service/content.service';

import { ContentComponent } from './content.component';

describe('Component Tests', () => {
  describe('Content Management Component', () => {
    let comp: ContentComponent;
    let fixture: ComponentFixture<ContentComponent>;
    let service: ContentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContentComponent],
      })
        .overrideTemplate(ContentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContentComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ContentService);

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
      expect(comp.contents?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

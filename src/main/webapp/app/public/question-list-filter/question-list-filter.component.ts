import { Component, OnInit } from '@angular/core';
import { TagMetaDataService } from 'app/entities/tag-meta-data/service/tag-meta-data.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'app/entities/question/service/question.service';
import { QuestionListComponent } from '../question-list/question-list.component';

@Component({
  selector: 'jhi-question-list-filter',
  templateUrl: './question-list-filter.component.html',
})
export class QuestionListFilterComponent implements OnInit {
  panels = [] as any;
  questionListComponent: any;
  subjectId?: number;
  constructor(
    private questionService: QuestionService,
    private activatedRoute: ActivatedRoute,
    private tagMetaDataService: TagMetaDataService
  ) {}

  ngOnInit(): void {
    this.subjectId = +this.activatedRoute.snapshot.queryParamMap.get('subject')!;
    this.getAllTags();
    this.questionListComponent = new QuestionListComponent(this.activatedRoute, this.questionService);
  }

  getAllTags(): void {
    this.tagMetaDataService.findAllUniqueTags().subscribe((res: HttpResponse<any>) => {
      const tags = res.body ?? Map;
      Object.keys(tags).forEach(key => {
        const tagValues = [] as any;
        const filterLabels = tags[key];
        filterLabels.map((filterLabel: string) => {
          tagValues.push({ filterBy: key, label: filterLabel, value: filterLabel });
        });
        this.panels?.push({ active: true, name: key.toString(), disabled: false, values: tagValues });
        console.warn('tags value: ', tags[key]);
      });
      console.warn('Panel: ', this.panels);
    });
  }
  filterQuestions(filterTags: any): void {
    const filters = this.getFilters(filterTags);
    this.questionListComponent.getQuestionsBySubjectWithFilters(this.subjectId, filters);
  }

  getFilters(filterTags: any): Map<any, any> {
    const filters = new Map();
    filterTags.map((filterTag: any) => {
      if (filterTag.checked) {
        let values = filters.get(filterTag.filterBy);
        if (values == null) {
          values = new Array<string>();
        }
        values.push(filterTag.value);
        filters.set(filterTag.filterBy, values);
      }
    });
    return filters;
  }
}

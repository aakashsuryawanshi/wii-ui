import { ITagMetaData } from 'app/entities/tag-meta-data/tag-meta-data.model';
import { IContent } from 'app/entities/content/content.model';
import { ISubject } from 'app/entities/subject/subject.model';

export interface IQuestion {
  id?: number;
  title?: string | null;
  description?: string | null;
  topic?: string | null;
  tags?: ITagMetaData[] | null;
  answers?: IContent[] | null;
  subject?: ISubject | null;
}

export class Question implements IQuestion {
  constructor(
    public id?: number,
    public title?: string | null,
    public description?: string | null,
    public topic?: string | null,
    public tags?: ITagMetaData[] | null,
    public answers?: IContent[] | null,
    public subject?: ISubject | null
  ) {}
}

export function getQuestionIdentifier(question: IQuestion): number | undefined {
  return question.id;
}

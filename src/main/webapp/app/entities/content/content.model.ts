import { IQuestion } from 'app/entities/question/question.model';
import { ContentType } from 'app/entities/enumerations/content-type.model';

export interface IContent {
  id?: number;
  type?: ContentType | null;
  text?: string | null;
  filePath?: string | null;
  seqNum?: number | null;
  question?: IQuestion | null;
}

export class Content implements IContent {
  constructor(
    public id?: number,
    public type?: ContentType | null,
    public text?: string | null,
    public filePath?: string | null,
    public seqNum?: number | null,
    public question?: IQuestion | null
  ) {}
}

export function getContentIdentifier(content: IContent): number | undefined {
  return content.id;
}

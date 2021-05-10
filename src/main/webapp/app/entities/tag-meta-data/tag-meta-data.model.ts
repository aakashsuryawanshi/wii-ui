import { IQuestion } from 'app/entities/question/question.model';

export interface ITagMetaData {
  id?: number;
  key?: string | null;
  value?: string | null;
  question?: IQuestion | null;
}

export class TagMetaData implements ITagMetaData {
  constructor(public id?: number, public key?: string | null, public value?: string | null, public question?: IQuestion | null) {}
}

export function getTagMetaDataIdentifier(tagMetaData: ITagMetaData): number | undefined {
  return tagMetaData.id;
}

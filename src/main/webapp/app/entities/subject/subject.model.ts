import { IQuestion } from 'app/entities/question/question.model';
import { ISemester } from 'app/entities/semester/semester.model';

export interface ISubject {
  id?: number;
  name?: string | null;
  description?: string | null;
  questions?: IQuestion[] | null;
  semester?: ISemester | null;
}

export class Subject implements ISubject {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public questions?: IQuestion[] | null,
    public semester?: ISemester | null
  ) {}
}

export function getSubjectIdentifier(subject: ISubject): number | undefined {
  return subject.id;
}

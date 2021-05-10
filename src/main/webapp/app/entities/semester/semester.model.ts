import { ISubject } from 'app/entities/subject/subject.model';
import { IBranch } from 'app/entities/branch/branch.model';

export interface ISemester {
  id?: number;
  name?: string | null;
  description?: string | null;
  subjects?: ISubject[] | null;
  branch?: IBranch | null;
}

export class Semester implements ISemester {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public subjects?: ISubject[] | null,
    public branch?: IBranch | null
  ) {}
}

export function getSemesterIdentifier(semester: ISemester): number | undefined {
  return semester.id;
}

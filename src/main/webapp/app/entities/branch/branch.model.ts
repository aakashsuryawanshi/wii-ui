import { ISemester } from 'app/entities/semester/semester.model';
import { IDomain } from 'app/entities/domain/domain.model';

export interface IBranch {
  id?: number;
  name?: string | null;
  description?: string | null;
  semesters?: ISemester[] | null;
  domain?: IDomain | null;
}

export class Branch implements IBranch {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public semesters?: ISemester[] | null,
    public domain?: IDomain | null
  ) {}
}

export function getBranchIdentifier(branch: IBranch): number | undefined {
  return branch.id;
}

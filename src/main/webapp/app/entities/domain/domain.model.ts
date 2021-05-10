import { IBranch } from 'app/entities/branch/branch.model';

export interface IDomain {
  id?: number;
  name?: string | null;
  description?: string | null;
  branches?: IBranch[] | null;
}

export class Domain implements IDomain {
  constructor(public id?: number, public name?: string | null, public description?: string | null, public branches?: IBranch[] | null) {}
}

export function getDomainIdentifier(domain: IDomain): number | undefined {
  return domain.id;
}

import { IFileMetaData } from 'app/entities/file-meta-data/file-meta-data.model';

export interface IFileDetails {
  id?: number;
  sourceName?: string | null;
  destinationName?: string | null;
  destination?: string | null;
  metaData?: string | null;
  metadata?: IFileMetaData[] | null;
}

export class FileDetails implements IFileDetails {
  constructor(
    public id?: number,
    public sourceName?: string | null,
    public destinationName?: string | null,
    public destination?: string | null,
    public metaData?: string | null,
    public metadata?: IFileMetaData[] | null
  ) {}
}

export function getFileDetailsIdentifier(fileDetails: IFileDetails): number | undefined {
  return fileDetails.id;
}

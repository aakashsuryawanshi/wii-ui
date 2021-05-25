import { IFileDetails } from 'app/entities/file-details/file-details.model';

export interface IFileMetaData {
  id?: number;
  key?: string | null;
  value?: string | null;
  fileDetails?: IFileDetails | null;
}

export class FileMetaData implements IFileMetaData {
  constructor(public id?: number, public key?: string | null, public value?: string | null, public fileDetails?: IFileDetails | null) {}
}

export function getFileMetaDataIdentifier(fileMetaData: IFileMetaData): number | undefined {
  return fileMetaData.id;
}

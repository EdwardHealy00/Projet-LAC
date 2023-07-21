export interface Document {
  id_: number;
  documentType: string;
  title: string;
  type: string;
  format: string;
  addedOn: string;
  isPending: boolean;
  file: any;
}

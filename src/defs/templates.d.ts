export interface TmplDialogEntry {
  id: number;
  parent: number;
  meta: TmplDialogEntryField[];
  metaLength: number;
  isRoot?: number;
  isGroup?: number;
  branches?: number;
  links?: OutgoingLink[];
}

export interface TmplDialogEntryField {
  id: number;
  isDialog: string | undefined;
  isTask: string | undefined;
  text: string | undefined;
  textFull: string | undefined;
  sequence: string | undefined;
  actor: string | undefined;
  conversant: string | undefined;
  inputID: string | undefined;
  outputID: string | undefined;
}
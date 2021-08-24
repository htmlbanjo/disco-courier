import IResultEntry from './import.d'

interface IConversationEntry extends IResultEntry {
  tasks: []
}

export type TConversationEntry = IConversationEntry

export interface ITmplDialogEntry {
  id: number
  parent: number
  meta: TmplDialogEntryField[]
  metaLength: number
  isRoot?: number
  isGroup?: number
  branches?: number
  links?: OutgoingLink[]
}

export interface ITmplDialogEntryField {
  id: number
  isDialog: string | undefined
  isTask: string | undefined
  text: string | undefined
  textFull: string | undefined
  sequence: string | undefined
  actor: string | undefined
  conversant: string | undefined
  inputID: string | undefined
  outputID: string | undefined
}
interface ILinkRow {
  originConversationId: number
  originDialogId: number
  destinationConversationId: number
  destinationDialogId: number
  isConnector: number
  priority: number
}

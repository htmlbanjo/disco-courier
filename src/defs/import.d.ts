export type StringBool = 'true' | 'false' | 'True' | 'False' | ''

export interface Field {
  title: string
  value: string
  type: number
  typeString: string
}

export interface OutgoingLink {
  originConversationID: number
  originDialogueID: number
  destinationConversationID: number
  destinationDialogueID: number
  isConnector: number
  priority: number
}

export interface DialogueEntry {
  id: number
  conversationID: string
  isRoot?: number
  isGroup?: number
  outgoingLinks?: OutgoingLink[]
  fields: Field[]
  nodeColor?: string
  delaySimStatus?: number
  falseConditionAction?: string
  conditionPriority?: number
  conditionsString?: string
  userScript: string
  onExecute?: {
    m_PersistentCalls: {
      m_Calls: any[]
    }
  }
  canvasRect?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface BaseItem {
  id: number
  title: string
  value: string
  fields: Field[]
  nodeColor?: string
  description?: string
}

export interface ActorItem extends BaseItem {
  portrait?: {
    m_FileID: number
    m_PathID: number
  }
  spritePortrait?: {
    m_FileID: number
    m_PathID: number
  }
  alternatePortraits: any[]
  spritePortraits: any[]
}

export interface ConversationItem extends BaseItem {
  overrideSettings?: {
    useOverrides: number
    overrideSubtitleSettings: number
    showNPCSubtitlesDuringLine: number
    showNPCSubtitlesWithResponses: number
    showPCSubtitlesDuringLine: number
    skipPCSubtitleAfterResponseMenu: number
    subtitleCharsPerSecond: number
    minSubtitleSeconds: number
    continueButton: number
    overrideSequenceSettings: number
    defaultSequence: string
    defaultPlayerSequence: string
    defaultResponseMenuSequence: string
    overrideInputSettings: number
    alwaysForceResponseMenu: number
    includeInvalidEntries: number
    responseTimeout: number
  }
}

export interface DialogueItem extends BaseItem {
  dialogueEntries: DialogueEntry[]
}

type TKeyOutputFunction = (
  value: string | boolean | number
) => string | boolean | number

interface IKeyFunctionOption {
  returnKey?: string
  returnValueFn?: TKeyOutputFunction
}

interface IKeyStringFunctionOption {
  returnKey?: string
  returnValueFn?: (value: string) => string
}
interface IKeyNumberFunctionOption {
  returnKey?: string
  returnValueFn?: (value: number) => number
}
interface IKeyBooleanFunctionOption {
  returnKey?: string
  returnValueFn?: (value: boolean) => boolean
}
interface ISupportedVersion {
  version: string
  rowCounts?: {
    actors: number
    locations: number
    variables: number
    items: number
    conversations: number
  }
  selectors?: {}
}
interface ICurrentVersion extends ISupportedVersion {
  version: string | false
}

interface IResultEntry {
  [index: string]: string | boolean | number
}

interface IResultEntryNumber {
  [index: string]: number
}
interface IResultEntryString {
  [index: string]: string
}
interface IResultEntryBoolean {
  [index: string]: boolean
}

type TItem = BaseItem | ActorItem | ConversationItem
type TSearchableItem = Item | DialogueEntry | Field
type TWithFields = Item | DialogueEntry

export {
  TItem,
  TSearchableItem,
  TWithFields,
  IResultEntry,
  IResultEntryString,
  IResultEntryNumber,
  IResultEntryBoolean,
  IKeyStringFunctionOption,
  IKeyNumberFunctionOption,
  IKeyBooleanFunctionOption,
  ISupportedVersion,
  ICurrentVersion,
  TKeyOutputFunction,
  IKeyFunctionOption
}

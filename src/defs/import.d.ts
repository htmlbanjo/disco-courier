export type StringBool = "true" | "false" | "True" | "False" | ""

export interface Field {
  title: string;
  value: string;
  type: number;
  typeString: string;
}

export interface OutgoingLink {
  originConversationID: number;
  originDialogueID: number;
  destinationConversationID: number;
  destinationDialogueID: number;
  isConnector: number;
  priority: number;
}

//interface DialogueEntryField {
//  title: "Title" | "Articy Id" | "Actor" | "Dialogue Text" | "Conversant" | "inputId" | "outputId" | "Sequence",

export interface DialogueEntry {
  id: number;
  conversationID: string;
  isRoot?: number;
  isGroup?: number;
  outgoingLinks?: OutgoingLink[];
  fields: Field[];
  nodeColor?: string;
  delaySimStatus?: number;
  falseConditionAction?: string;
  conditionPriority?: number;
  conditionsString?: string;
  userScript: string;
  onExecute?: {
    m_PersistentCalls: {
      m_Calls: any[]
    };
  };
  canvasRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface BaseItem {
  title: string;
  value: string;
  fields: Field[];
  nodeColor?: string;
  description?: string;
}

export interface ActorItem extends BaseItem {
  portrait?: {
    m_FileID: number;
    m_PathID: number;
  },
  spritePortrait?: {
    m_FileID: number;
    m_PathID: number;
  },
  alternatePortraits: any[],
  spritePortraits: any[]
}

export interface ConversationItem extends BaseItem {
  overrideSettings?: {
    useOverrides: number;
    overrideSubtitleSettings: number;
    showNPCSubtitlesDuringLine: number;
    showNPCSubtitlesWithResponses: number;
    showPCSubtitlesDuringLine: number;
    skipPCSubtitleAfterResponseMenu: number;
    subtitleCharsPerSecond: number;
    minSubtitleSeconds: number;
    continueButton: number;
    overrideSequenceSettings: number;
    defaultSequence: string;
    defaultPlayerSequence: string;
    defaultResponseMenuSequence: string;
    overrideInputSettings: number;
    alwaysForceResponseMenu: number;
    includeInvalidEntries: number;
    responseTimeout: number;
  }
}


export interface DialogueItem extends BaseItem {
  dialogueEntries: DialogueEntry[];
}

export type Item = BaseItem | ActorItem | ConversationItem;
export type TSearchableItem = Item | DialogueEntry | Field;
export type TWithFields = Item | DialogueEntry;
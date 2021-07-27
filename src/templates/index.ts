import { LocationTemplate } from './locations.template'
import { VariableTemplate } from './variables.template'
import {
  ActorTemplate,
  SkillTemplate,
  AttributeTemplate,
  LookupTemplate
} from './actors.template'
import {
  ItemTemplate,
  ThoughtTemplate,
  KeyTemplate,
  SubstanceTemplate,
  ConsumableTemplate,
  GameTemplate,
  BookTemplate,
  ClothingTemplate,
  TareTemplate
} from './items.template'
import {
  ConversationTemplate,
  TaskTemplate,
  SubtaskTemplate,
  DialogTemplate,
  OrbTemplate,
  HubTemplate,
  CheckTemplate,
  WhiteCheckTemplate,
  RedCheckTemplate,
  PassiveCheckTemplate,
  GraphLinksTemplate
} from './conversations.template'

const templatize = (entity, item) => {
  switch (entity) {
    case 'actors':
      return ActorTemplate(item)
    case 'actors.skill':
      return SkillTemplate(item)
    case 'actors.attribute':
      return AttributeTemplate(item)
    case 'actors.lookup':
      return LookupTemplate(item)
    case 'items':
      return ItemTemplate(item)
    case 'items.thought':
      return ThoughtTemplate(item)
    case 'items.key':
      return KeyTemplate(item)
    case 'items.substance':
      return SubstanceTemplate(item)
    case 'items.consumable':
      return ConsumableTemplate(item)
    case 'items.game':
      return GameTemplate(item)
    case 'items.book':
      return BookTemplate(item)
    case 'items.clothing':
      return ClothingTemplate(item)
    case 'items.tare':
      return TareTemplate(item)
    case 'locations':
      return LocationTemplate(item)
    case 'variables':
      return VariableTemplate(item)
    case 'conversations':
      return ConversationTemplate(item)
    case 'conversations.task':
      return TaskTemplate(item)
    case 'conversations.subtask':
      return SubtaskTemplate(item)
    case 'conversations.dialog':
      return DialogTemplate(item)
    case 'conversations.orb':
      return OrbTemplate(item)
    case 'conversations.hub':
      return HubTemplate(item)
    case 'conversations.check':
      return CheckTemplate(item)
    case 'conversations.whitecheck':
      return WhiteCheckTemplate(item)
    case 'conversations.redcheck':
      return RedCheckTemplate(item)
    case 'conversations.passivecheck':
      return PassiveCheckTemplate(item)
    case 'conversations.link':
      return GraphLinksTemplate(item)
    default:
      return { item: item }
  }
}

export { templatize }

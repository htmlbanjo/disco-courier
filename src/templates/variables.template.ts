import { valueOf, description } from '../lib/inspection'

export const VariableTemplate = item => {
  const name = valueOf('Name', item)
  const initValue = item?.fields.find(
    a => a.title.toLowerCase() === 'initial value'
  )
  return {
    id: item.id,
    name: name,
    type: name.split('.')[0],
    label: name.split('.')[1],
    valueType: initValue.typeString.split('_')[1],
    defaultValue: initValue.value,
    description: description(item),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

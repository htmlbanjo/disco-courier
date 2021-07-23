import { valueOf } from '../lib/inspection'

export const LocationTemplate = item => {
  return {
    id: item.id,
    name: valueOf('Name', item),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

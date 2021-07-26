import { valueOf } from '../search/index.search'

export const LocationTemplate = item => {
  return {
    id: item.id,
    name: valueOf('Name', item),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

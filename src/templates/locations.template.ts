import { valueOf, tableDates } from '../search/index.search'

export const LocationTemplate = item => {
  return {
    locationId: item.id,
    name: valueOf('Name', item),
    ...tableDates(item)
  }
}

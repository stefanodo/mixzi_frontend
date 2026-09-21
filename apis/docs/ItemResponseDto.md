
# ItemResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`name` | string
`unit` | string
`category` | object
`minStock` | object
`maxStock` | object
`wasteDefaultPct` | object
`isActive` | boolean
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { ItemResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "name": Harina 000,
  "unit": kg,
  "category": Secos,
  "minStock": 5,
  "maxStock": 50,
  "wasteDefaultPct": 3.5,
  "isActive": true,
  "createdAt": 2026-08-21T10:00Z,
  "updatedAt": 2026-08-21T10:00Z,
} satisfies ItemResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ItemResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



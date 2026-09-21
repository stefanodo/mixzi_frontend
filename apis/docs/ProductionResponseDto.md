
# ProductionResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`recipeId` | string
`locationId` | string
`quantityProduced` | number
`costSnapshot` | number
`producedAt` | Date
`createdBy` | object
`createdAt` | Date

## Example

```typescript
import type { ProductionResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": f1a2b3c4-1234-4abc-9def-000000000300,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "recipeId": d1e2f3a4-1234-4abc-9def-000000000100,
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "quantityProduced": 8,
  "costSnapshot": 1622.25,
  "producedAt": 2026-08-26T15:00Z,
  "createdBy": d75f3fae-f084-4dde-b974-7a7d61e92a42,
  "createdAt": 2026-08-26T15:00Z,
} satisfies ProductionResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProductionResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



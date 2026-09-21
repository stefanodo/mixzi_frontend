
# WasteResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`itemId` | object
`locationId` | string
`quantity` | number
`reason` | string
`status` | string
`sourceType` | string
`confidence` | number
`rawText` | object
`costSnapshot` | object
`responsibleUserId` | object
`notes` | object
`createdAt` | Date
`confirmedAt` | object

## Example

```typescript
import type { WasteResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": e1a2b3c4-1234-4abc-9def-000000000400,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "quantity": 2.5,
  "reason": Caducado,
  "status": DRAFT,
  "sourceType": manual,
  "confidence": 100,
  "rawText": se rompieron dos bandejas de tomate cherry,
  "costSnapshot": 212.5,
  "responsibleUserId": d75f3fae-f084-4dde-b974-7a7d61e92a42,
  "notes": Se encontró vencido,
  "createdAt": 2026-09-08T10:00Z,
  "confirmedAt": 2026-09-08T10:05:00.000Z,
} satisfies WasteResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WasteResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



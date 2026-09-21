
# OrderResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`locationId` | string
`status` | string
`responsibleUserId` | object
`note` | object
`createdAt` | Date

## Example

```typescript
import type { OrderResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": f1a2b3c4-1234-4abc-9def-000000000600,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "status": DRAFT,
  "responsibleUserId": d75f3fae-f084-4dde-b974-7a7d61e92a42,
  "note": Pedido semanal de verduras,
  "createdAt": 2026-09-09T10:00Z,
} satisfies OrderResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrderResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# OrderLineResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`orderId` | string
`itemId` | string
`supplierId` | object
`quantity` | number
`isChecked` | boolean
`createdAt` | Date

## Example

```typescript
import type { OrderLineResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": f9a8b7c6-1234-4abc-9def-000000000500,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "orderId": f1a2b3c4-1234-4abc-9def-000000000600,
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "supplierId": c4e2d3b1-1234-4abc-9def-56789abcdef1,
  "quantity": 10,
  "isChecked": false,
  "createdAt": 2026-09-09T10:00Z,
} satisfies OrderLineResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrderLineResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



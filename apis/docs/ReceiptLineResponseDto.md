
# ReceiptLineResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`receiptId` | string
`itemId` | string
`quantity` | number
`unitPrice` | object
`createdAt` | Date

## Example

```typescript
import type { ReceiptLineResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": a9b8c7d6-1234-4abc-9def-000000000800,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "receiptId": f1a2b3c4-1234-4abc-9def-000000000700,
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "quantity": 10,
  "unitPrice": 2.5,
  "createdAt": 2026-09-09T10:05Z,
} satisfies ReceiptLineResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReceiptLineResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# ReceiptResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`locationId` | string
`supplierId` | object
`status` | string
`docNumber` | object
`docDate` | object
`note` | object
`createdAt` | Date
`validatedAt` | object

## Example

```typescript
import type { ReceiptResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": f1a2b3c4-1234-4abc-9def-000000000700,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "supplierId": c4e2d3b1-1234-4abc-9def-56789abcdef1,
  "status": PENDING,
  "docNumber": ALB-2026-00458,
  "docDate": 2026-09-09,
  "note": Entrega de la mañana,
  "createdAt": 2026-09-09T10:00Z,
  "validatedAt": 2026-09-09T10:15:00.000Z,
} satisfies ReceiptResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReceiptResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



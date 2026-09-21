
# ReceiptExtractionLineResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`extractionRunId` | string
`rawItemName` | object
`rawQuantity` | object
`rawUnit` | object
`rawPrice` | object
`matchedItemId` | object
`confidence` | object
`reviewStatus` | string
`createdAt` | Date

## Example

```typescript
import type { ReceiptExtractionLineResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": e5f6a7b8-1234-4abc-9def-000000000900,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "extractionRunId": d4e5f6a7-1234-4abc-9def-000000000950,
  "rawItemName": Tomate Cherry,
  "rawQuantity": 10,
  "rawUnit": kg,
  "rawPrice": 2.5,
  "matchedItemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "confidence": 95,
  "reviewStatus": PENDING,
  "createdAt": 2026-09-09T10:01Z,
} satisfies ReceiptExtractionLineResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReceiptExtractionLineResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# ReceiptExtractionRunResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`receiptId` | string
`documentUrl` | string
`rawResult` | { [key: string]: any; }
`createdAt` | Date
`pendingLines` | [Array&lt;ReceiptExtractionLineResponseDto&gt;](ReceiptExtractionLineResponseDto.md)

## Example

```typescript
import type { ReceiptExtractionRunResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": d4e5f6a7-1234-4abc-9def-000000000950,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "receiptId": f1a2b3c4-1234-4abc-9def-000000000700,
  "documentUrl": 994e7340-.../a1b2c3d4-....jpg,
  "rawResult": null,
  "createdAt": 2026-09-09T10:01Z,
  "pendingLines": null,
} satisfies ReceiptExtractionRunResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReceiptExtractionRunResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



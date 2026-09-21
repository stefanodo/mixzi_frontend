
# StockLotResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`itemId` | string
`locationId` | string
`supplierId` | object
`quantityReceived` | number
`quantityRemaining` | number
`unitCost` | number
`receivedAt` | Date
`createdAt` | Date

## Example

```typescript
import type { StockLotResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": c4d5e6f7-1234-4abc-9def-abcdef012345,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "supplierId": a1b2c3d4-5678-4abc-9def-000000000001,
  "quantityReceived": 25,
  "quantityRemaining": 25,
  "unitCost": 850.5,
  "receivedAt": 2026-08-25T10:00Z,
  "createdAt": 2026-08-25T10:05Z,
} satisfies StockLotResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as StockLotResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



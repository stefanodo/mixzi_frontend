
# CreateStockLotDto


## Properties

Name | Type
------------ | -------------
`itemId` | string
`locationId` | string
`supplierId` | string
`quantityReceived` | number
`unitCost` | number
`receivedAt` | string

## Example

```typescript
import type { CreateStockLotDto } from ''

// TODO: Update the object below with actual values
const example = {
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "supplierId": a1b2c3d4-5678-4abc-9def-000000000001,
  "quantityReceived": 25,
  "unitCost": 850.5,
  "receivedAt": 2026-08-25T10:00:00.000Z,
} satisfies CreateStockLotDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateStockLotDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



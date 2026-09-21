
# SupplierItemPriceResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`itemId` | string
`supplierId` | string
`price` | number
`unitConversionFactor` | object
`isPreferred` | boolean
`validFrom` | Date
`createdAt` | Date
`supplier` | [SupplierResponseDto](SupplierResponseDto.md)

## Example

```typescript
import type { SupplierItemPriceResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": c1d2e3f4-5678-4abc-9def-000000000002,
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "supplierId": a1b2c3d4-5678-4abc-9def-000000000001,
  "price": 12.5,
  "unitConversionFactor": 24,
  "isPreferred": false,
  "validFrom": 2026-08-24T10:00Z,
  "createdAt": 2026-08-24T10:00Z,
  "supplier": null,
} satisfies SupplierItemPriceResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SupplierItemPriceResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



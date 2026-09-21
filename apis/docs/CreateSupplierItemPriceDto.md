
# CreateSupplierItemPriceDto


## Properties

Name | Type
------------ | -------------
`supplierId` | string
`price` | number
`unitConversionFactor` | number
`isPreferred` | boolean

## Example

```typescript
import type { CreateSupplierItemPriceDto } from ''

// TODO: Update the object below with actual values
const example = {
  "supplierId": a1b2c3d4-5678-4abc-9def-000000000001,
  "price": 12.5,
  "unitConversionFactor": 24,
  "isPreferred": false,
} satisfies CreateSupplierItemPriceDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateSupplierItemPriceDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



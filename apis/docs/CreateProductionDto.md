
# CreateProductionDto


## Properties

Name | Type
------------ | -------------
`recipeId` | string
`locationId` | string
`quantityProduced` | number

## Example

```typescript
import type { CreateProductionDto } from ''

// TODO: Update the object below with actual values
const example = {
  "recipeId": d1e2f3a4-1234-4abc-9def-000000000100,
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "quantityProduced": 8,
} satisfies CreateProductionDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateProductionDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



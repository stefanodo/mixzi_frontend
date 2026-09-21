
# RecipeExtractionLineResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`extractionRunId` | string
`rawIngredientName` | object
`rawQuantity` | object
`rawUnit` | object
`matchedItemId` | object
`matchedRecipeId` | object
`confidence` | object
`quantityNet` | object
`wastePct` | number
`reviewStatus` | string
`createdAt` | Date

## Example

```typescript
import type { RecipeExtractionLineResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": e5f6a7b8-1234-4abc-9def-000000000900,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "extractionRunId": d4e5f6a7-1234-4abc-9def-000000000950,
  "rawIngredientName": Aceite de oliva,
  "rawQuantity": 0.5,
  "rawUnit": l,
  "matchedItemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "matchedRecipeId": d1e2f3a4-1234-4abc-9def-000000000100,
  "confidence": 95,
  "quantityNet": 0.5,
  "wastePct": 10,
  "reviewStatus": PENDING,
  "createdAt": 2026-09-10T10:01Z,
} satisfies RecipeExtractionLineResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RecipeExtractionLineResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



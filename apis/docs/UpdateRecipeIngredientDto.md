
# UpdateRecipeIngredientDto


## Properties

Name | Type
------------ | -------------
`subrecipeId` | string
`quantityNet` | number
`wastePct` | number

## Example

```typescript
import type { UpdateRecipeIngredientDto } from ''

// TODO: Update the object below with actual values
const example = {
  "subrecipeId": d1e2f3a4-1234-4abc-9def-000000000100,
  "quantityNet": 0.5,
  "wastePct": 10,
} satisfies UpdateRecipeIngredientDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateRecipeIngredientDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



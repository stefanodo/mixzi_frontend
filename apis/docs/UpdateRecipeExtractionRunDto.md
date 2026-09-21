
# UpdateRecipeExtractionRunDto


## Properties

Name | Type
------------ | -------------
`suggestedName` | string
`suggestedYieldPortions` | number
`suggestedPrepSteps` | string

## Example

```typescript
import type { UpdateRecipeExtractionRunDto } from ''

// TODO: Update the object below with actual values
const example = {
  "suggestedName": Ensalada César,
  "suggestedYieldPortions": 4,
  "suggestedPrepSteps": 1. Lavar la lechuga. 2. Preparar el aderezo...,
} satisfies UpdateRecipeExtractionRunDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateRecipeExtractionRunDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



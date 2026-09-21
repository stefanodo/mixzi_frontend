
# RecipeIngredientResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`recipeId` | string
`itemId` | object
`subrecipeId` | object
`quantityNet` | number
`wastePct` | number
`quantityGross` | number
`createdAt` | Date
`item` | [ItemResponseDto](ItemResponseDto.md)

## Example

```typescript
import type { RecipeIngredientResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": e1f2a3b4-1234-4abc-9def-000000000200,
  "recipeId": d1e2f3a4-1234-4abc-9def-000000000100,
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "subrecipeId": d1e2f3a4-1234-4abc-9def-000000000105,
  "quantityNet": 0.5,
  "wastePct": 10,
  "quantityGross": 0.5556,
  "createdAt": 2026-08-26T10:00Z,
  "item": null,
} satisfies RecipeIngredientResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RecipeIngredientResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



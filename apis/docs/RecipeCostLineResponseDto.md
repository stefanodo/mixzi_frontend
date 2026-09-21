
# RecipeCostLineResponseDto


## Properties

Name | Type
------------ | -------------
`recipeIngredientId` | string
`itemId` | object
`itemName` | object
`subrecipeId` | object
`subrecipeName` | object
`quantityNet` | number
`wastePct` | number
`quantityGross` | number
`unitCost` | number
`lineCost` | number

## Example

```typescript
import type { RecipeCostLineResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "recipeIngredientId": e1f2a3b4-1234-4abc-9def-000000000200,
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "itemName": Harina 000,
  "subrecipeId": d1e2f3a4-1234-4abc-9def-000000000105,
  "subrecipeName": Vinagreta,
  "quantityNet": 0.5,
  "wastePct": 10,
  "quantityGross": 0.5556,
  "unitCost": 850.5,
  "lineCost": 472.61,
} satisfies RecipeCostLineResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RecipeCostLineResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



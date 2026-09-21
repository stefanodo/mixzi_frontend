
# UpdateRecipeDto


## Properties

Name | Type
------------ | -------------
`name` | string
`code` | string
`category` | string
`subcategory` | string
`yieldPortions` | number
`yieldFinalUnit` | string
`contingencyPct` | number
`targetFoodCostPct` | number
`targetMarginPct` | number
`manualPrice` | number
`prepTimeMin` | number
`cookTimeMin` | number
`laborHourlyCost` | number
`laborPeople` | number
`prepSteps` | string
`allergens` | string
`producedItemId` | string

## Example

```typescript
import type { UpdateRecipeDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": Salsa boloñesa,
  "code": SALSA-001,
  "category": Salsas,
  "subcategory": Salsas base,
  "yieldPortions": 4,
  "yieldFinalUnit": kg,
  "contingencyPct": 5,
  "targetFoodCostPct": 30,
  "targetMarginPct": 70,
  "manualPrice": 1200,
  "prepTimeMin": 15,
  "cookTimeMin": 45,
  "laborHourlyCost": 3500,
  "laborPeople": 1,
  "prepSteps": 1. Sofreír la cebolla. 2. Agregar el tomate...,
  "allergens": Gluten, lácteos,
  "producedItemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
} satisfies UpdateRecipeDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateRecipeDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



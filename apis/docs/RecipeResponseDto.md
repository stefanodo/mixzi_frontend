
# RecipeResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`name` | string
`code` | object
`category` | object
`subcategory` | object
`yieldPortions` | number
`yieldFinalUnit` | object
`contingencyPct` | number
`targetFoodCostPct` | number
`targetMarginPct` | number
`manualPrice` | object
`prepTimeMin` | object
`cookTimeMin` | object
`laborHourlyCost` | object
`laborPeople` | object
`prepSteps` | object
`allergens` | object
`producedItemId` | object
`isActive` | boolean
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { RecipeResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": d1e2f3a4-1234-4abc-9def-000000000100,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
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
  "isActive": true,
  "createdAt": 2026-08-26T10:00Z,
  "updatedAt": 2026-08-26T10:00Z,
} satisfies RecipeResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RecipeResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



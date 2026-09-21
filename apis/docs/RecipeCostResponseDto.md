
# RecipeCostResponseDto


## Properties

Name | Type
------------ | -------------
`recipeId` | string
`locationId` | string
`lines` | [Array&lt;RecipeCostLineResponseDto&gt;](RecipeCostLineResponseDto.md)
`costBase` | number
`contingencyPct` | number
`costAdjusted` | number
`yieldPortions` | number
`costPerPortion` | number
`producedItemId` | object

## Example

```typescript
import type { RecipeCostResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "recipeId": d1e2f3a4-1234-4abc-9def-000000000100,
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "lines": null,
  "costBase": 1892.44,
  "contingencyPct": 5,
  "costAdjusted": 1987.06,
  "yieldPortions": 4,
  "costPerPortion": 496.77,
  "producedItemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
} satisfies RecipeCostResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RecipeCostResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



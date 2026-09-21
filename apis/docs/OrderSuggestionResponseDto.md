
# OrderSuggestionResponseDto


## Properties

Name | Type
------------ | -------------
`itemId` | string
`itemName` | string
`currentStock` | number
`minStock` | number
`maxStock` | number
`suggestedQuantity` | number

## Example

```typescript
import type { OrderSuggestionResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "itemName": Tomate,
  "currentStock": 2,
  "minStock": 5,
  "maxStock": 20,
  "suggestedQuantity": 18,
} satisfies OrderSuggestionResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrderSuggestionResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



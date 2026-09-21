
# WasteByItemResponseDto


## Properties

Name | Type
------------ | -------------
`itemId` | string
`itemName` | string
`totalCost` | number
`totalQuantity` | number
`recordCount` | number

## Example

```typescript
import type { WasteByItemResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "itemName": Harina 000,
  "totalCost": 850.5,
  "totalQuantity": 12.5,
  "recordCount": 4,
} satisfies WasteByItemResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WasteByItemResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



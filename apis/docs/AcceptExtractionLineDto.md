
# AcceptExtractionLineDto


## Properties

Name | Type
------------ | -------------
`quantity` | number
`unitPrice` | number
`itemId` | string
`createNewItem` | boolean
`newItem` | [NewItemFromReceiptDto](NewItemFromReceiptDto.md)

## Example

```typescript
import type { AcceptExtractionLineDto } from ''

// TODO: Update the object below with actual values
const example = {
  "quantity": 10,
  "unitPrice": 2.5,
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "createNewItem": true,
  "newItem": null,
} satisfies AcceptExtractionLineDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AcceptExtractionLineDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



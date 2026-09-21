
# UpdateWasteDto


## Properties

Name | Type
------------ | -------------
`itemId` | string
`quantity` | number
`reason` | string
`notes` | string

## Example

```typescript
import type { UpdateWasteDto } from ''

// TODO: Update the object below with actual values
const example = {
  "itemId": b3f1c2a0-1234-4abc-9def-56789abcdef0,
  "quantity": 2.5,
  "reason": Rotura,
  "notes": Confirmado con el encargado de cocina,
} satisfies UpdateWasteDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateWasteDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



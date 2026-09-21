
# CreateReceiptDto


## Properties

Name | Type
------------ | -------------
`locationId` | string
`supplierId` | string
`note` | string

## Example

```typescript
import type { CreateReceiptDto } from ''

// TODO: Update the object below with actual values
const example = {
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "supplierId": c4e2d3b1-1234-4abc-9def-56789abcdef1,
  "note": Entrega de la mañana,
} satisfies CreateReceiptDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateReceiptDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



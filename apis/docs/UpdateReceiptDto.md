
# UpdateReceiptDto


## Properties

Name | Type
------------ | -------------
`supplierId` | string
`docNumber` | string
`docDate` | string
`note` | string

## Example

```typescript
import type { UpdateReceiptDto } from ''

// TODO: Update the object below with actual values
const example = {
  "supplierId": c4e2d3b1-1234-4abc-9def-56789abcdef1,
  "docNumber": ALB-2026-00458,
  "docDate": 2026-09-09,
  "note": Entrega de la mañana,
} satisfies UpdateReceiptDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateReceiptDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



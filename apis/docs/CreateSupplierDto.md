
# CreateSupplierDto


## Properties

Name | Type
------------ | -------------
`name` | string
`taxId` | string
`phone` | string
`email` | string
`address` | string

## Example

```typescript
import type { CreateSupplierDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": Distribuidora Molinos SA,
  "taxId": 30-12345678-9,
  "phone": +54 11 4444-5555,
  "email": ventas@molinos.com,
  "address": Av. Siempreviva 742, CABA,
} satisfies CreateSupplierDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateSupplierDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# CreateOrderDto


## Properties

Name | Type
------------ | -------------
`locationId` | string
`note` | string

## Example

```typescript
import type { CreateOrderDto } from ''

// TODO: Update the object below with actual values
const example = {
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "note": Pedido semanal de verduras,
} satisfies CreateOrderDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



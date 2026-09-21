
# CompleteRegistrationDto


## Properties

Name | Type
------------ | -------------
`restaurantName` | string
`address` | string
`postalCode` | string
`planId` | string

## Example

```typescript
import type { CompleteRegistrationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "restaurantName": Restaurante El Buen Sabor,
  "address": Av. Siempreviva 742, CABA,
  "postalCode": 1414,
  "planId": a1b2c3d4-5678-4abc-9def-000000000099,
} satisfies CompleteRegistrationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CompleteRegistrationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



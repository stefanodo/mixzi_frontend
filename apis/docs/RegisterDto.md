
# RegisterDto


## Properties

Name | Type
------------ | -------------
`firstName` | string
`lastName` | string
`email` | string
`password` | string
`termsAccepted` | boolean
`termsVersion` | string

## Example

```typescript
import type { RegisterDto } from ''

// TODO: Update the object below with actual values
const example = {
  "firstName": Juan,
  "lastName": Pérez,
  "email": juan.perez@example.com,
  "password": SuperSecreta123!,
  "termsAccepted": true,
  "termsVersion": v1,
} satisfies RegisterDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RegisterDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



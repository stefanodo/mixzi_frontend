
# ConfirmLoginCodeDto


## Properties

Name | Type
------------ | -------------
`email` | string
`code` | string

## Example

```typescript
import type { ConfirmLoginCodeDto } from ''

// TODO: Update the object below with actual values
const example = {
  "email": juan.perez@example.com,
  "code": 123456,
} satisfies ConfirmLoginCodeDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ConfirmLoginCodeDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



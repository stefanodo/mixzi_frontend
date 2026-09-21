
# CreateLocationDto


## Properties

Name | Type
------------ | -------------
`name` | string
`address` | string

## Example

```typescript
import type { CreateLocationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": Local Palermo,
  "address": Av. Santa Fe 1234, CABA,
} satisfies CreateLocationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateLocationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



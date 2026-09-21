
# WasteByReasonResponseDto


## Properties

Name | Type
------------ | -------------
`reason` | string
`totalCost` | number
`recordCount` | number

## Example

```typescript
import type { WasteByReasonResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "reason": Caducado,
  "totalCost": 620.25,
  "recordCount": 6,
} satisfies WasteByReasonResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WasteByReasonResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



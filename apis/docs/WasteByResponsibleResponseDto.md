
# WasteByResponsibleResponseDto


## Properties

Name | Type
------------ | -------------
`responsibleUserId` | object
`totalCost` | number
`recordCount` | number

## Example

```typescript
import type { WasteByResponsibleResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "responsibleUserId": d75f3fae-f084-4dde-b974-7a7d61e92a42,
  "totalCost": 1200.75,
  "recordCount": 9,
} satisfies WasteByResponsibleResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WasteByResponsibleResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



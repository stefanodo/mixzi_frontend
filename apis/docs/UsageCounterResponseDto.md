
# UsageCounterResponseDto


## Properties

Name | Type
------------ | -------------
`counterKey` | string
`periodStart` | string
`count` | number

## Example

```typescript
import type { UsageCounterResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "counterKey": receipt_scans,
  "periodStart": 2026-09-01,
  "count": 2,
} satisfies UsageCounterResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UsageCounterResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# WasteAnalyticsResponseDto


## Properties

Name | Type
------------ | -------------
`totalCost` | number
`totalRecords` | number
`byItem` | [Array&lt;WasteByItemResponseDto&gt;](WasteByItemResponseDto.md)
`byReason` | [Array&lt;WasteByReasonResponseDto&gt;](WasteByReasonResponseDto.md)
`byResponsible` | [Array&lt;WasteByResponsibleResponseDto&gt;](WasteByResponsibleResponseDto.md)

## Example

```typescript
import type { WasteAnalyticsResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "totalCost": 1892.44,
  "totalRecords": 15,
  "byItem": null,
  "byReason": null,
  "byResponsible": null,
} satisfies WasteAnalyticsResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WasteAnalyticsResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# RecipeExtractionRunResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`documentUrl` | string
`rawResult` | { [key: string]: any; }
`suggestedName` | object
`suggestedYieldPortions` | object
`suggestedPrepSteps` | object
`status` | string
`createdAt` | Date
`lines` | [Array&lt;RecipeExtractionLineResponseDto&gt;](RecipeExtractionLineResponseDto.md)

## Example

```typescript
import type { RecipeExtractionRunResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": d4e5f6a7-1234-4abc-9def-000000000950,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "documentUrl": 994e7340-.../a1b2c3d4-....jpg,
  "rawResult": null,
  "suggestedName": Ensalada César,
  "suggestedYieldPortions": 4,
  "suggestedPrepSteps": 1. Lavar la lechuga. 2. Preparar el aderezo...,
  "status": PENDING,
  "createdAt": 2026-09-10T10:00Z,
  "lines": null,
} satisfies RecipeExtractionRunResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RecipeExtractionRunResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



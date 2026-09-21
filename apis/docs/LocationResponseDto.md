
# LocationResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`name` | string
`address` | object
`isActive` | boolean
`createdAt` | Date

## Example

```typescript
import type { LocationResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": a1b2c3d4-5678-4abc-9def-000000000010,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "name": Local Palermo,
  "address": Av. Santa Fe 1234, CABA,
  "isActive": true,
  "createdAt": 2026-08-25T10:00Z,
} satisfies LocationResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LocationResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



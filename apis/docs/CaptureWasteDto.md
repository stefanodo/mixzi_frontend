
# CaptureWasteDto


## Properties

Name | Type
------------ | -------------
`sourceType` | string
`locationId` | string
`rawText` | string
`confidence` | number
`quantity` | number
`reason` | string
`notes` | string

## Example

```typescript
import type { CaptureWasteDto } from ''

// TODO: Update the object below with actual values
const example = {
  "sourceType": voice,
  "locationId": a1b2c3d4-5678-4abc-9def-000000000010,
  "rawText": se rompieron dos bandejas de tomate cherry,
  "confidence": 62,
  "quantity": 2,
  "reason": Rotura,
  "notes": Capturado desde la app móvil,
} satisfies CaptureWasteDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CaptureWasteDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



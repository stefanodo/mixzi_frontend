
# SupplierResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`tenantId` | string
`name` | string
`taxId` | object
`phone` | object
`email` | object
`address` | object
`isActive` | boolean
`createdAt` | Date

## Example

```typescript
import type { SupplierResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": a1b2c3d4-5678-4abc-9def-000000000001,
  "tenantId": a1b2c3d4-5678-4abc-9def-000000000000,
  "name": Distribuidora Molinos SA,
  "taxId": 30-12345678-9,
  "phone": +54 11 4444-5555,
  "email": ventas@molinos.com,
  "address": Av. Siempreviva 742, CABA,
  "isActive": true,
  "createdAt": 2026-08-21T10:00Z,
} satisfies SupplierResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SupplierResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



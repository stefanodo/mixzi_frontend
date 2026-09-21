
# UpdateItemDto


## Properties

Name | Type
------------ | -------------
`name` | string
`unit` | string
`category` | string
`minStock` | number
`maxStock` | number
`wasteDefaultPct` | number

## Example

```typescript
import type { UpdateItemDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": Harina 000,
  "unit": kg,
  "category": Secos,
  "minStock": 5,
  "maxStock": 50,
  "wasteDefaultPct": 3.5,
} satisfies UpdateItemDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateItemDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



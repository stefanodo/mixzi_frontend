# RecipeIngredientsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**recipeIngredientsControllerCreate**](RecipeIngredientsApi.md#recipeingredientscontrollercreate) | **POST** /recipes/{recipeId}/ingredients | Add an ingredient line to a recipe |
| [**recipeIngredientsControllerFindByRecipe**](RecipeIngredientsApi.md#recipeingredientscontrollerfindbyrecipe) | **GET** /recipes/{recipeId}/ingredients | List a recipe\&#39;s ingredients |
| [**recipeIngredientsControllerRemove**](RecipeIngredientsApi.md#recipeingredientscontrollerremove) | **DELETE** /recipes/{recipeId}/ingredients/{id} | Remove an ingredient line from a recipe |
| [**recipeIngredientsControllerUpdate**](RecipeIngredientsApi.md#recipeingredientscontrollerupdate) | **PATCH** /recipes/{recipeId}/ingredients/{id} | Update the quantity or waste percentage of an ingredient line |



## recipeIngredientsControllerCreate

> RecipeIngredientResponseDto recipeIngredientsControllerCreate(recipeId, createRecipeIngredientDto)

Add an ingredient line to a recipe

Exactly one of itemId (must already exist and belong to the tenant; quantityNet is in the item\&#39;s own base unit, no conversion happens here) or subrecipeId (another recipe, used as a subrecipe — cannot equal the recipe itself; quantityNet is in the same \&#39;yield unit\&#39; as the subrecipe\&#39;s own yieldPortions, see CLAUDE.md\&#39;s Subrecipes section).

### Example

```ts
import {
  Configuration,
  RecipeIngredientsApi,
} from '';
import type { RecipeIngredientsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeIngredientsApi(config);

  const body = {
    // string | Recipe ID
    recipeId: d1e2f3a4-1234-4abc-9def-000000000100,
    // CreateRecipeIngredientDto
    createRecipeIngredientDto: ...,
  } satisfies RecipeIngredientsControllerCreateRequest;

  try {
    const data = await api.recipeIngredientsControllerCreate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **recipeId** | `string` | Recipe ID | [Defaults to `undefined`] |
| **createRecipeIngredientDto** | [CreateRecipeIngredientDto](CreateRecipeIngredientDto.md) |  | |

### Return type

[**RecipeIngredientResponseDto**](RecipeIngredientResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **400** | The request body failed validation (missing field, wrong type, disallowed value, ...). &#x60;fields&#x60; details each violation: &#x60;field&#x60; is the property name (dot-path if nested), &#x60;code&#x60; a stable identifier of the error type — see FieldErrorCode in src/common/errors/field-error-codes.ts. |  -  |
| **401** | The JWT is missing, invalid, or expired |  -  |
| **403** | The tenant\&#39;s plan does not include this feature  The authenticated user does not have a tenant assigned yet |  -  |
| **404** | Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipeIngredientsControllerFindByRecipe

> Array&lt;RecipeIngredientResponseDto&gt; recipeIngredientsControllerFindByRecipe(recipeId)

List a recipe\&#39;s ingredients

### Example

```ts
import {
  Configuration,
  RecipeIngredientsApi,
} from '';
import type { RecipeIngredientsControllerFindByRecipeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeIngredientsApi(config);

  const body = {
    // string | Recipe ID
    recipeId: d1e2f3a4-1234-4abc-9def-000000000100,
  } satisfies RecipeIngredientsControllerFindByRecipeRequest;

  try {
    const data = await api.recipeIngredientsControllerFindByRecipe(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **recipeId** | `string` | Recipe ID | [Defaults to `undefined`] |

### Return type

[**Array&lt;RecipeIngredientResponseDto&gt;**](RecipeIngredientResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **401** | The JWT is missing, invalid, or expired |  -  |
| **403** | The tenant\&#39;s plan does not include this feature  The authenticated user does not have a tenant assigned yet |  -  |
| **404** | Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipeIngredientsControllerRemove

> RecipeIngredientResponseDto recipeIngredientsControllerRemove(recipeId, id)

Remove an ingredient line from a recipe

Physical delete, not a soft delete — a recipe line that no longer exists has no meaningful \&quot;inactive\&quot; state to preserve.

### Example

```ts
import {
  Configuration,
  RecipeIngredientsApi,
} from '';
import type { RecipeIngredientsControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeIngredientsApi(config);

  const body = {
    // string | Recipe ID
    recipeId: d1e2f3a4-1234-4abc-9def-000000000100,
    // string | Recipe ingredient line ID
    id: e1f2a3b4-1234-4abc-9def-000000000200,
  } satisfies RecipeIngredientsControllerRemoveRequest;

  try {
    const data = await api.recipeIngredientsControllerRemove(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **recipeId** | `string` | Recipe ID | [Defaults to `undefined`] |
| **id** | `string` | Recipe ingredient line ID | [Defaults to `undefined`] |

### Return type

[**RecipeIngredientResponseDto**](RecipeIngredientResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **401** | The JWT is missing, invalid, or expired |  -  |
| **403** | The tenant\&#39;s plan does not include this feature  The authenticated user does not have a tenant assigned yet |  -  |
| **404** | Does not exist for this recipe, or does not belong to the user\&#39;s tenant |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipeIngredientsControllerUpdate

> RecipeIngredientResponseDto recipeIngredientsControllerUpdate(recipeId, id, updateRecipeIngredientDto)

Update the quantity or waste percentage of an ingredient line

Cannot move this line to a different item — delete and recreate instead.

### Example

```ts
import {
  Configuration,
  RecipeIngredientsApi,
} from '';
import type { RecipeIngredientsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeIngredientsApi(config);

  const body = {
    // string | Recipe ID
    recipeId: d1e2f3a4-1234-4abc-9def-000000000100,
    // string | Recipe ingredient line ID
    id: e1f2a3b4-1234-4abc-9def-000000000200,
    // UpdateRecipeIngredientDto
    updateRecipeIngredientDto: ...,
  } satisfies RecipeIngredientsControllerUpdateRequest;

  try {
    const data = await api.recipeIngredientsControllerUpdate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **recipeId** | `string` | Recipe ID | [Defaults to `undefined`] |
| **id** | `string` | Recipe ingredient line ID | [Defaults to `undefined`] |
| **updateRecipeIngredientDto** | [UpdateRecipeIngredientDto](UpdateRecipeIngredientDto.md) |  | |

### Return type

[**RecipeIngredientResponseDto**](RecipeIngredientResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | The request body failed validation (missing field, wrong type, disallowed value, ...). &#x60;fields&#x60; details each violation: &#x60;field&#x60; is the property name (dot-path if nested), &#x60;code&#x60; a stable identifier of the error type — see FieldErrorCode in src/common/errors/field-error-codes.ts. |  -  |
| **401** | The JWT is missing, invalid, or expired |  -  |
| **403** | The tenant\&#39;s plan does not include this feature  The authenticated user does not have a tenant assigned yet |  -  |
| **404** | Does not exist for this recipe, or does not belong to the user\&#39;s tenant |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


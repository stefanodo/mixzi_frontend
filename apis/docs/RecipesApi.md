# RecipesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**recipesControllerCreate**](RecipesApi.md#recipescontrollercreate) | **POST** /recipes | Create a recipe in the current tenant |
| [**recipesControllerFindAll**](RecipesApi.md#recipescontrollerfindall) | **GET** /recipes | List the current tenant\&#39;s recipes |
| [**recipesControllerFindOne**](RecipesApi.md#recipescontrollerfindone) | **GET** /recipes/{id} | Get a recipe by ID |
| [**recipesControllerGetCost**](RecipesApi.md#recipescontrollergetcost) | **GET** /recipes/{id}/cost | Calculate the current cost of a recipe at a location |
| [**recipesControllerRemove**](RecipesApi.md#recipescontrollerremove) | **DELETE** /recipes/{id} | Deactivate a recipe (soft delete) |
| [**recipesControllerUpdate**](RecipesApi.md#recipescontrollerupdate) | **PATCH** /recipes/{id} | Edit fields of a recipe |



## recipesControllerCreate

> RecipeResponseDto recipesControllerCreate(createRecipeDto)

Create a recipe in the current tenant

producedItemId, if given, must be an existing item belonging to the current tenant.

### Example

```ts
import {
  Configuration,
  RecipesApi,
} from '';
import type { RecipesControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipesApi(config);

  const body = {
    // CreateRecipeDto
    createRecipeDto: ...,
  } satisfies RecipesControllerCreateRequest;

  try {
    const data = await api.recipesControllerCreate(body);
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
| **createRecipeDto** | [CreateRecipeDto](CreateRecipeDto.md) |  | |

### Return type

[**RecipeResponseDto**](RecipeResponseDto.md)

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


## recipesControllerFindAll

> Array&lt;RecipeResponseDto&gt; recipesControllerFindAll()

List the current tenant\&#39;s recipes

Returns only active recipes (is_active &#x3D; true).

### Example

```ts
import {
  Configuration,
  RecipesApi,
} from '';
import type { RecipesControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipesApi(config);

  try {
    const data = await api.recipesControllerFindAll();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;RecipeResponseDto&gt;**](RecipeResponseDto.md)

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
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipesControllerFindOne

> RecipeResponseDto recipesControllerFindOne(id)

Get a recipe by ID

### Example

```ts
import {
  Configuration,
  RecipesApi,
} from '';
import type { RecipesControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipesApi(config);

  const body = {
    // string | Recipe ID
    id: d1e2f3a4-1234-4abc-9def-000000000100,
  } satisfies RecipesControllerFindOneRequest;

  try {
    const data = await api.recipesControllerFindOne(body);
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
| **id** | `string` | Recipe ID | [Defaults to `undefined`] |

### Return type

[**RecipeResponseDto**](RecipeResponseDto.md)

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


## recipesControllerGetCost

> RecipeCostResponseDto recipesControllerGetCost(id, locationId)

Calculate the current cost of a recipe at a location

Computed fresh on every call from the recipe\&#39;s current ingredients and the current oldest available stock_lots price at the given location — never a stored/cached figure. locationId is required: a recipe isn\&#39;t tied to one location, and costing without pinning one would be arbitrary for a multi-location tenant. Fails with NO_STOCK_AVAILABLE_FOR_COSTING if any ingredient has no stock at that location, instead of silently treating that line as free.

### Example

```ts
import {
  Configuration,
  RecipesApi,
} from '';
import type { RecipesControllerGetCostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipesApi(config);

  const body = {
    // string | Recipe ID
    id: d1e2f3a4-1234-4abc-9def-000000000100,
    // string | Location whose stock_lots to cost this recipe against. Required.
    locationId: a1b2c3d4-5678-4abc-9def-000000000010,
  } satisfies RecipesControllerGetCostRequest;

  try {
    const data = await api.recipesControllerGetCost(body);
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
| **id** | `string` | Recipe ID | [Defaults to `undefined`] |
| **locationId** | `string` | Location whose stock_lots to cost this recipe against. Required. | [Defaults to `undefined`] |

### Return type

[**RecipeCostResponseDto**](RecipeCostResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | The request body failed validation (missing field, wrong type, disallowed value, ...). &#x60;fields&#x60; details each violation: &#x60;field&#x60; is the property name (dot-path if nested), &#x60;code&#x60; a stable identifier of the error type — see FieldErrorCode in src/common/errors/field-error-codes.ts. |  -  |
| **401** | The JWT is missing, invalid, or expired |  -  |
| **403** | The tenant\&#39;s plan does not include this feature  The authenticated user does not have a tenant assigned yet |  -  |
| **404** | Does not exist, or does not belong to the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **409** | At least one ingredient has no stock_lots with quantity_remaining &gt; 0 at the given location — no cost figure is returned, not even a partial one |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipesControllerRemove

> RecipeResponseDto recipesControllerRemove(id)

Deactivate a recipe (soft delete)

Not a physical DELETE: sets is_active &#x3D; false. The recipe stops appearing in GET /recipes but still exists in the database, along with its ingredients.

### Example

```ts
import {
  Configuration,
  RecipesApi,
} from '';
import type { RecipesControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipesApi(config);

  const body = {
    // string | Recipe ID
    id: d1e2f3a4-1234-4abc-9def-000000000100,
  } satisfies RecipesControllerRemoveRequest;

  try {
    const data = await api.recipesControllerRemove(body);
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
| **id** | `string` | Recipe ID | [Defaults to `undefined`] |

### Return type

[**RecipeResponseDto**](RecipeResponseDto.md)

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


## recipesControllerUpdate

> RecipeResponseDto recipesControllerUpdate(id, updateRecipeDto)

Edit fields of a recipe

### Example

```ts
import {
  Configuration,
  RecipesApi,
} from '';
import type { RecipesControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipesApi(config);

  const body = {
    // string | Recipe ID
    id: d1e2f3a4-1234-4abc-9def-000000000100,
    // UpdateRecipeDto
    updateRecipeDto: ...,
  } satisfies RecipesControllerUpdateRequest;

  try {
    const data = await api.recipesControllerUpdate(body);
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
| **id** | `string` | Recipe ID | [Defaults to `undefined`] |
| **updateRecipeDto** | [UpdateRecipeDto](UpdateRecipeDto.md) |  | |

### Return type

[**RecipeResponseDto**](RecipeResponseDto.md)

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
| **404** | Does not exist, or does not belong to the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


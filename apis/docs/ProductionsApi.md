# ProductionsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**productionsControllerCreate**](ProductionsApi.md#productionscontrollercreate) | **POST** /productions | Record a production, consuming ingredient stock |
| [**productionsControllerFindAll**](ProductionsApi.md#productionscontrollerfindall) | **GET** /productions | List the current tenant\&#39;s productions |
| [**productionsControllerFindOne**](ProductionsApi.md#productionscontrollerfindone) | **GET** /productions/{id} | Get a production by ID |



## productionsControllerCreate

> ProductionResponseDto productionsControllerCreate(createProductionDto)

Record a production, consuming ingredient stock

Freezes the recipe\&#39;s current cost (same calculation as GET /recipes/:id/cost) into costSnapshot, then consumes every ingredient\&#39;s stock via FIFO — all inside one transaction: if any ingredient can\&#39;t be fully consumed, nothing is consumed and no production is created.

### Example

```ts
import {
  Configuration,
  ProductionsApi,
} from '';
import type { ProductionsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductionsApi(config);

  const body = {
    // CreateProductionDto
    createProductionDto: ...,
  } satisfies ProductionsControllerCreateRequest;

  try {
    const data = await api.productionsControllerCreate(body);
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
| **createProductionDto** | [CreateProductionDto](CreateProductionDto.md) |  | |

### Return type

[**ProductionResponseDto**](ProductionResponseDto.md)

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
| **404** | Does not exist, or does not belong to the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **409** | Stock could not be fully consumed at the given location — nothing was consumed, the whole operation was rolled back (all-or-nothing)  At least one ingredient has no stock_lots with quantity_remaining &gt; 0 at the given location — no cost figure is returned, not even a partial one |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## productionsControllerFindAll

> Array&lt;ProductionResponseDto&gt; productionsControllerFindAll(recipeId, locationId)

List the current tenant\&#39;s productions

Optionally filtered by recipeId and/or locationId. Newest first.

### Example

```ts
import {
  Configuration,
  ProductionsApi,
} from '';
import type { ProductionsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductionsApi(config);

  const body = {
    // string | Filter to productions of this recipe (optional)
    recipeId: d1e2f3a4-1234-4abc-9def-000000000100,
    // string | Filter to productions at this location (optional)
    locationId: a1b2c3d4-5678-4abc-9def-000000000010,
  } satisfies ProductionsControllerFindAllRequest;

  try {
    const data = await api.productionsControllerFindAll(body);
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
| **recipeId** | `string` | Filter to productions of this recipe | [Optional] [Defaults to `undefined`] |
| **locationId** | `string` | Filter to productions at this location | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;ProductionResponseDto&gt;**](ProductionResponseDto.md)

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


## productionsControllerFindOne

> ProductionResponseDto productionsControllerFindOne(id)

Get a production by ID

### Example

```ts
import {
  Configuration,
  ProductionsApi,
} from '';
import type { ProductionsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductionsApi(config);

  const body = {
    // string | Production ID
    id: f1a2b3c4-1234-4abc-9def-000000000300,
  } satisfies ProductionsControllerFindOneRequest;

  try {
    const data = await api.productionsControllerFindOne(body);
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
| **id** | `string` | Production ID | [Defaults to `undefined`] |

### Return type

[**ProductionResponseDto**](ProductionResponseDto.md)

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


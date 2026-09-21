# StockLotsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**stockLotsControllerCreate**](StockLotsApi.md#stocklotscontrollercreate) | **POST** /stock-lots | Manually record a received stock lot |
| [**stockLotsControllerFindAll**](StockLotsApi.md#stocklotscontrollerfindall) | **GET** /stock-lots | List the current tenant\&#39;s stock lots |
| [**stockLotsControllerFindOne**](StockLotsApi.md#stocklotscontrollerfindone) | **GET** /stock-lots/{id} | Get a stock lot by ID |
| [**stockLotsControllerUpdate**](StockLotsApi.md#stocklotscontrollerupdate) | **PATCH** /stock-lots/{id} | Correct the unit cost of a stock lot |



## stockLotsControllerCreate

> StockLotResponseDto stockLotsControllerCreate(createStockLotDto)

Manually record a received stock lot

quantityRemaining starts equal to quantityReceived — there\&#39;s no way to set it directly. itemId/locationId must belong to the tenant; supplierId, if given, too.

### Example

```ts
import {
  Configuration,
  StockLotsApi,
} from '';
import type { StockLotsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StockLotsApi(config);

  const body = {
    // CreateStockLotDto
    createStockLotDto: ...,
  } satisfies StockLotsControllerCreateRequest;

  try {
    const data = await api.stockLotsControllerCreate(body);
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
| **createStockLotDto** | [CreateStockLotDto](CreateStockLotDto.md) |  | |

### Return type

[**StockLotResponseDto**](StockLotResponseDto.md)

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
| **404** | Does not exist, or does not belong to the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## stockLotsControllerFindAll

> Array&lt;StockLotResponseDto&gt; stockLotsControllerFindAll()

List the current tenant\&#39;s stock lots

Includes lots with quantityRemaining &#x3D; 0 — nothing is ever hidden or deleted, see class description.

### Example

```ts
import {
  Configuration,
  StockLotsApi,
} from '';
import type { StockLotsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StockLotsApi(config);

  try {
    const data = await api.stockLotsControllerFindAll();
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

[**Array&lt;StockLotResponseDto&gt;**](StockLotResponseDto.md)

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


## stockLotsControllerFindOne

> StockLotResponseDto stockLotsControllerFindOne(id)

Get a stock lot by ID

### Example

```ts
import {
  Configuration,
  StockLotsApi,
} from '';
import type { StockLotsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StockLotsApi(config);

  const body = {
    // string | Stock lot ID
    id: c4d5e6f7-1234-4abc-9def-abcdef012345,
  } satisfies StockLotsControllerFindOneRequest;

  try {
    const data = await api.stockLotsControllerFindOne(body);
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
| **id** | `string` | Stock lot ID | [Defaults to `undefined`] |

### Return type

[**StockLotResponseDto**](StockLotResponseDto.md)

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


## stockLotsControllerUpdate

> StockLotResponseDto stockLotsControllerUpdate(id, updateStockLotDto)

Correct the unit cost of a stock lot

The only editable field, for fixing a data-entry mistake. itemId, locationId, supplierId, quantityReceived, and receivedAt are immutable once the lot exists; quantityRemaining can only change via FIFO consumption, never through this endpoint.

### Example

```ts
import {
  Configuration,
  StockLotsApi,
} from '';
import type { StockLotsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new StockLotsApi(config);

  const body = {
    // string | Stock lot ID
    id: c4d5e6f7-1234-4abc-9def-abcdef012345,
    // UpdateStockLotDto
    updateStockLotDto: ...,
  } satisfies StockLotsControllerUpdateRequest;

  try {
    const data = await api.stockLotsControllerUpdate(body);
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
| **id** | `string` | Stock lot ID | [Defaults to `undefined`] |
| **updateStockLotDto** | [UpdateStockLotDto](UpdateStockLotDto.md) |  | |

### Return type

[**StockLotResponseDto**](StockLotResponseDto.md)

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
| **404** | Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


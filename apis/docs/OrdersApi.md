# OrdersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**ordersControllerAddLine**](OrdersApi.md#orderscontrolleraddline) | **POST** /orders/{id}/lines | Add a line to a DRAFT order |
| [**ordersControllerArchive**](OrdersApi.md#orderscontrollerarchive) | **PATCH** /orders/{id}/archive | Archive an order |
| [**ordersControllerConfirm**](OrdersApi.md#orderscontrollerconfirm) | **PATCH** /orders/{id}/confirm | Confirm an order |
| [**ordersControllerCreate**](OrdersApi.md#orderscontrollercreate) | **POST** /orders | Create a new order |
| [**ordersControllerFindAll**](OrdersApi.md#orderscontrollerfindall) | **GET** /orders | List the current tenant\&#39;s orders |
| [**ordersControllerFindOne**](OrdersApi.md#orderscontrollerfindone) | **GET** /orders/{id} | Get an order by ID, including its lines |
| [**ordersControllerGetSuggestions**](OrdersApi.md#orderscontrollergetsuggestions) | **GET** /orders/suggestions | Suggest order quantities based on min/max stock thresholds |
| [**ordersControllerRemove**](OrdersApi.md#orderscontrollerremove) | **DELETE** /orders/{id} | Delete a DRAFT order |
| [**ordersControllerRemoveLine**](OrdersApi.md#orderscontrollerremoveline) | **DELETE** /orders/{id}/lines/{lineId} | Remove a line from a DRAFT order |
| [**ordersControllerReopen**](OrdersApi.md#orderscontrollerreopen) | **PATCH** /orders/{id}/reopen | Reopen a confirmed order for editing |
| [**ordersControllerRestore**](OrdersApi.md#orderscontrollerrestore) | **PATCH** /orders/{id}/restore | Restore an archived order |
| [**ordersControllerUpdateLine**](OrdersApi.md#orderscontrollerupdateline) | **PATCH** /orders/{id}/lines/{lineId} | Update a line of a DRAFT order |



## ordersControllerAddLine

> OrderLineResponseDto ordersControllerAddLine(id, createOrderLineDto)

Add a line to a DRAFT order

Not allowed once the order is CONFIRMED or ARCHIVED.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerAddLineRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Order ID
    id: f1a2b3c4-1234-4abc-9def-000000000600,
    // CreateOrderLineDto
    createOrderLineDto: ...,
  } satisfies OrdersControllerAddLineRequest;

  try {
    const data = await api.ordersControllerAddLine(body);
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
| **id** | `string` | Order ID | [Defaults to `undefined`] |
| **createOrderLineDto** | [CreateOrderLineDto](CreateOrderLineDto.md) |  | |

### Return type

[**OrderLineResponseDto**](OrderLineResponseDto.md)

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
| **409** | Line mutations/delete: only allowed while DRAFT. confirm: only from DRAFT. reopen: only from CONFIRMED. archive: only from CONFIRMED. restore: only from ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ordersControllerArchive

> OrderResponseDto ordersControllerArchive(id)

Archive an order

CONFIRMED -&gt; ARCHIVED only.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerArchiveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Order ID
    id: f1a2b3c4-1234-4abc-9def-000000000600,
  } satisfies OrdersControllerArchiveRequest;

  try {
    const data = await api.ordersControllerArchive(body);
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
| **id** | `string` | Order ID | [Defaults to `undefined`] |

### Return type

[**OrderResponseDto**](OrderResponseDto.md)

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
| **409** | Line mutations/delete: only allowed while DRAFT. confirm: only from DRAFT. reopen: only from CONFIRMED. archive: only from CONFIRMED. restore: only from ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ordersControllerConfirm

> OrderResponseDto ordersControllerConfirm(id)

Confirm an order

DRAFT -&gt; CONFIRMED. Freezes the lines (no more edits) and has no effect on stock whatsoever — only a future Receipts module moves stock.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerConfirmRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Order ID
    id: f1a2b3c4-1234-4abc-9def-000000000600,
  } satisfies OrdersControllerConfirmRequest;

  try {
    const data = await api.ordersControllerConfirm(body);
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
| **id** | `string` | Order ID | [Defaults to `undefined`] |

### Return type

[**OrderResponseDto**](OrderResponseDto.md)

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
| **409** | Line mutations/delete: only allowed while DRAFT. confirm: only from DRAFT. reopen: only from CONFIRMED. archive: only from CONFIRMED. restore: only from ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ordersControllerCreate

> OrderResponseDto ordersControllerCreate(createOrderDto)

Create a new order

Always starts as DRAFT — add lines afterward via POST /orders/:id/lines.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // CreateOrderDto
    createOrderDto: ...,
  } satisfies OrdersControllerCreateRequest;

  try {
    const data = await api.ordersControllerCreate(body);
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
| **createOrderDto** | [CreateOrderDto](CreateOrderDto.md) |  | |

### Return type

[**OrderResponseDto**](OrderResponseDto.md)

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


## ordersControllerFindAll

> Array&lt;OrderResponseDto&gt; ordersControllerFindAll(status, locationId)

List the current tenant\&#39;s orders

Optionally filtered by status and/or locationId. Newest first.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // 'DRAFT' | 'CONFIRMED' | 'ARCHIVED' (optional)
    status: status_example,
    // string (optional)
    locationId: a1b2c3d4-5678-4abc-9def-000000000010,
  } satisfies OrdersControllerFindAllRequest;

  try {
    const data = await api.ordersControllerFindAll(body);
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
| **status** | `DRAFT`, `CONFIRMED`, `ARCHIVED` |  | [Optional] [Defaults to `undefined`] [Enum: DRAFT, CONFIRMED, ARCHIVED] |
| **locationId** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;OrderResponseDto&gt;**](OrderResponseDto.md)

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


## ordersControllerFindOne

> OrderDetailResponseDto ordersControllerFindOne(id)

Get an order by ID, including its lines

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Order ID
    id: f1a2b3c4-1234-4abc-9def-000000000600,
  } satisfies OrdersControllerFindOneRequest;

  try {
    const data = await api.ordersControllerFindOne(body);
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
| **id** | `string` | Order ID | [Defaults to `undefined`] |

### Return type

[**OrderDetailResponseDto**](OrderDetailResponseDto.md)

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


## ordersControllerGetSuggestions

> Array&lt;OrderSuggestionResponseDto&gt; ordersControllerGetSuggestions(locationId)

Suggest order quantities based on min/max stock thresholds

Read-only — creates nothing. For every active item with both minStock and maxStock set, if the current stock at locationId is below minStock, suggests maxStock - currentStock. Items missing either threshold never appear here.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerGetSuggestionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Location whose stock to check against min/max thresholds
    locationId: a1b2c3d4-5678-4abc-9def-000000000010,
  } satisfies OrdersControllerGetSuggestionsRequest;

  try {
    const data = await api.ordersControllerGetSuggestions(body);
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
| **locationId** | `string` | Location whose stock to check against min/max thresholds | [Defaults to `undefined`] |

### Return type

[**Array&lt;OrderSuggestionResponseDto&gt;**](OrderSuggestionResponseDto.md)

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
| **404** | Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ordersControllerRemove

> OrderResponseDto ordersControllerRemove(id)

Delete a DRAFT order

Physical delete of the order and its lines (order_lines cascade). Only allowed from DRAFT — a CONFIRMED or ARCHIVED order is a record of intent, not an abandoned draft.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Order ID
    id: f1a2b3c4-1234-4abc-9def-000000000600,
  } satisfies OrdersControllerRemoveRequest;

  try {
    const data = await api.ordersControllerRemove(body);
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
| **id** | `string` | Order ID | [Defaults to `undefined`] |

### Return type

[**OrderResponseDto**](OrderResponseDto.md)

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
| **409** | Line mutations/delete: only allowed while DRAFT. confirm: only from DRAFT. reopen: only from CONFIRMED. archive: only from CONFIRMED. restore: only from ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ordersControllerRemoveLine

> OrderLineResponseDto ordersControllerRemoveLine(id, lineId)

Remove a line from a DRAFT order

Not allowed once the order is CONFIRMED or ARCHIVED.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerRemoveLineRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Order ID
    id: f1a2b3c4-1234-4abc-9def-000000000600,
    // string | Order line ID
    lineId: f9a8b7c6-1234-4abc-9def-000000000500,
  } satisfies OrdersControllerRemoveLineRequest;

  try {
    const data = await api.ordersControllerRemoveLine(body);
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
| **id** | `string` | Order ID | [Defaults to `undefined`] |
| **lineId** | `string` | Order line ID | [Defaults to `undefined`] |

### Return type

[**OrderLineResponseDto**](OrderLineResponseDto.md)

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
| **404** | Does not exist, or does not belong to this order/the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **409** | Line mutations/delete: only allowed while DRAFT. confirm: only from DRAFT. reopen: only from CONFIRMED. archive: only from CONFIRMED. restore: only from ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ordersControllerReopen

> OrderResponseDto ordersControllerReopen(id)

Reopen a confirmed order for editing

CONFIRMED -&gt; DRAFT, unlocking its lines again — the inverse of confirm. Distinct from restore (see below): this order was never archived.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerReopenRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Order ID
    id: f1a2b3c4-1234-4abc-9def-000000000600,
  } satisfies OrdersControllerReopenRequest;

  try {
    const data = await api.ordersControllerReopen(body);
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
| **id** | `string` | Order ID | [Defaults to `undefined`] |

### Return type

[**OrderResponseDto**](OrderResponseDto.md)

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
| **409** | Line mutations/delete: only allowed while DRAFT. confirm: only from DRAFT. reopen: only from CONFIRMED. archive: only from CONFIRMED. restore: only from ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ordersControllerRestore

> OrderResponseDto ordersControllerRestore(id)

Restore an archived order

ARCHIVED -&gt; CONFIRMED — the inverse of archive.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerRestoreRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Order ID
    id: f1a2b3c4-1234-4abc-9def-000000000600,
  } satisfies OrdersControllerRestoreRequest;

  try {
    const data = await api.ordersControllerRestore(body);
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
| **id** | `string` | Order ID | [Defaults to `undefined`] |

### Return type

[**OrderResponseDto**](OrderResponseDto.md)

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
| **409** | Line mutations/delete: only allowed while DRAFT. confirm: only from DRAFT. reopen: only from CONFIRMED. archive: only from CONFIRMED. restore: only from ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ordersControllerUpdateLine

> OrderLineResponseDto ordersControllerUpdateLine(id, lineId, updateOrderLineDto)

Update a line of a DRAFT order

quantity, supplierId, and/or isChecked. Not allowed once the order is CONFIRMED or ARCHIVED. Cannot move the line to a different item — remove and re-add instead.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrdersControllerUpdateLineRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new OrdersApi(config);

  const body = {
    // string | Order ID
    id: f1a2b3c4-1234-4abc-9def-000000000600,
    // string | Order line ID
    lineId: f9a8b7c6-1234-4abc-9def-000000000500,
    // UpdateOrderLineDto
    updateOrderLineDto: ...,
  } satisfies OrdersControllerUpdateLineRequest;

  try {
    const data = await api.ordersControllerUpdateLine(body);
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
| **id** | `string` | Order ID | [Defaults to `undefined`] |
| **lineId** | `string` | Order line ID | [Defaults to `undefined`] |
| **updateOrderLineDto** | [UpdateOrderLineDto](UpdateOrderLineDto.md) |  | |

### Return type

[**OrderLineResponseDto**](OrderLineResponseDto.md)

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
| **404** | Does not exist, or does not belong to the user\&#39;s tenant  Does not exist, or does not belong to this order/the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **409** | Line mutations/delete: only allowed while DRAFT. confirm: only from DRAFT. reopen: only from CONFIRMED. archive: only from CONFIRMED. restore: only from ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


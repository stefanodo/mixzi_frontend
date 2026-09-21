# ReceiptsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**receiptsControllerArchive**](ReceiptsApi.md#receiptscontrollerarchive) | **POST** /receipts/{id}/archive | Archive a receipt |
| [**receiptsControllerCancel**](ReceiptsApi.md#receiptscontrollercancel) | **POST** /receipts/{id}/cancel | Cancel a receipt |
| [**receiptsControllerConfirm**](ReceiptsApi.md#receiptscontrollerconfirm) | **POST** /receipts/{id}/confirm | Confirm a receipt, generating stock |
| [**receiptsControllerCreate**](ReceiptsApi.md#receiptscontrollercreate) | **POST** /receipts | Create a new receipt |
| [**receiptsControllerFindAll**](ReceiptsApi.md#receiptscontrollerfindall) | **GET** /receipts | List the current tenant\&#39;s receipts |
| [**receiptsControllerFindOne**](ReceiptsApi.md#receiptscontrollerfindone) | **GET** /receipts/{id} | Get a receipt by ID |
| [**receiptsControllerRemove**](ReceiptsApi.md#receiptscontrollerremove) | **DELETE** /receipts/{id} | Delete a receipt |
| [**receiptsControllerRestore**](ReceiptsApi.md#receiptscontrollerrestore) | **POST** /receipts/{id}/restore | Restore an archived receipt |
| [**receiptsControllerUpdate**](ReceiptsApi.md#receiptscontrollerupdate) | **PATCH** /receipts/{id} | Edit a PENDING receipt\&#39;s header fields |



## receiptsControllerArchive

> ReceiptResponseDto receiptsControllerArchive(id)

Archive a receipt

CONFIRMED -&gt; ARCHIVED only.

### Example

```ts
import {
  Configuration,
  ReceiptsApi,
} from '';
import type { ReceiptsControllerArchiveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
  } satisfies ReceiptsControllerArchiveRequest;

  try {
    const data = await api.receiptsControllerArchive(body);
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
| **id** | `string` | Receipt ID | [Defaults to `undefined`] |

### Return type

[**ReceiptResponseDto**](ReceiptResponseDto.md)

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
| **409** | extract/accept/reject-line/PATCH: only while PENDING. confirm: only from PENDING. archive: only from CONFIRMED. restore: only from ARCHIVED. cancel: only from PENDING. delete: only from CONFIRMED or ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## receiptsControllerCancel

> ReceiptResponseDto receiptsControllerCancel(id)

Cancel a receipt

PENDING -&gt; CANCELED only. No stock effect — nothing was ever confirmed.

### Example

```ts
import {
  Configuration,
  ReceiptsApi,
} from '';
import type { ReceiptsControllerCancelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
  } satisfies ReceiptsControllerCancelRequest;

  try {
    const data = await api.receiptsControllerCancel(body);
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
| **id** | `string` | Receipt ID | [Defaults to `undefined`] |

### Return type

[**ReceiptResponseDto**](ReceiptResponseDto.md)

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
| **409** | extract/accept/reject-line/PATCH: only while PENDING. confirm: only from PENDING. archive: only from CONFIRMED. restore: only from ARCHIVED. cancel: only from PENDING. delete: only from CONFIRMED or ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## receiptsControllerConfirm

> ReceiptResponseDto receiptsControllerConfirm(id)

Confirm a receipt, generating stock

PENDING -&gt; CONFIRMED. Requires at least one accepted line, all with a unitPrice, and a resolved supplierId. Atomically: creates a stock_lot per line and upserts each item\&#39;s supplier_item_prices row (preserving isPreferred). Never touches items — no current_price column exists in this schema.

### Example

```ts
import {
  Configuration,
  ReceiptsApi,
} from '';
import type { ReceiptsControllerConfirmRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
  } satisfies ReceiptsControllerConfirmRequest;

  try {
    const data = await api.receiptsControllerConfirm(body);
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
| **id** | `string` | Receipt ID | [Defaults to `undefined`] |

### Return type

[**ReceiptResponseDto**](ReceiptResponseDto.md)

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
| **409** | The receipt has no supplierId set — resolve it via PATCH /receipts/:id before confirming  At least one accepted line has no unitPrice set — fill it in before confirming  The receipt has no accepted lines yet — accept at least one before confirming  extract/accept/reject-line/PATCH: only while PENDING. confirm: only from PENDING. archive: only from CONFIRMED. restore: only from ARCHIVED. cancel: only from PENDING. delete: only from CONFIRMED or ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## receiptsControllerCreate

> ReceiptResponseDto receiptsControllerCreate(createReceiptDto)

Create a new receipt

Always starts as PENDING. supplierId can be set now or later via PATCH.

### Example

```ts
import {
  Configuration,
  ReceiptsApi,
} from '';
import type { ReceiptsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsApi(config);

  const body = {
    // CreateReceiptDto
    createReceiptDto: ...,
  } satisfies ReceiptsControllerCreateRequest;

  try {
    const data = await api.receiptsControllerCreate(body);
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
| **createReceiptDto** | [CreateReceiptDto](CreateReceiptDto.md) |  | |

### Return type

[**ReceiptResponseDto**](ReceiptResponseDto.md)

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
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## receiptsControllerFindAll

> Array&lt;ReceiptResponseDto&gt; receiptsControllerFindAll(status, locationId)

List the current tenant\&#39;s receipts

Optionally filtered by status and/or locationId. Newest first.

### Example

```ts
import {
  Configuration,
  ReceiptsApi,
} from '';
import type { ReceiptsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsApi(config);

  const body = {
    // 'PENDING' | 'CONFIRMED' | 'ARCHIVED' | 'CANCELED' (optional)
    status: status_example,
    // string (optional)
    locationId: a1b2c3d4-5678-4abc-9def-000000000010,
  } satisfies ReceiptsControllerFindAllRequest;

  try {
    const data = await api.receiptsControllerFindAll(body);
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
| **status** | `PENDING`, `CONFIRMED`, `ARCHIVED`, `CANCELED` |  | [Optional] [Defaults to `undefined`] [Enum: PENDING, CONFIRMED, ARCHIVED, CANCELED] |
| **locationId** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;ReceiptResponseDto&gt;**](ReceiptResponseDto.md)

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


## receiptsControllerFindOne

> ReceiptDetailResponseDto receiptsControllerFindOne(id)

Get a receipt by ID

Includes its accepted lines and the most recent extraction run (with only that run\&#39;s still-pending lines).

### Example

```ts
import {
  Configuration,
  ReceiptsApi,
} from '';
import type { ReceiptsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
  } satisfies ReceiptsControllerFindOneRequest;

  try {
    const data = await api.receiptsControllerFindOne(body);
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
| **id** | `string` | Receipt ID | [Defaults to `undefined`] |

### Return type

[**ReceiptDetailResponseDto**](ReceiptDetailResponseDto.md)

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


## receiptsControllerRemove

> ReceiptResponseDto receiptsControllerRemove(id)

Delete a receipt

Only from CONFIRMED or ARCHIVED, and only if none of its stock_lots were ever consumed (quantity_remaining &#x3D;&#x3D;&#x3D; quantity_received on every one). Physical delete: the qualifying stock_lots, its receipt_lines, and the receipt itself — the extraction audit trail cascades automatically.

### Example

```ts
import {
  Configuration,
  ReceiptsApi,
} from '';
import type { ReceiptsControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
  } satisfies ReceiptsControllerRemoveRequest;

  try {
    const data = await api.receiptsControllerRemove(body);
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
| **id** | `string` | Receipt ID | [Defaults to `undefined`] |

### Return type

[**ReceiptResponseDto**](ReceiptResponseDto.md)

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
| **409** | At least one stock_lot generated by this receipt has already been partially or fully consumed — cannot delete  extract/accept/reject-line/PATCH: only while PENDING. confirm: only from PENDING. archive: only from CONFIRMED. restore: only from ARCHIVED. cancel: only from PENDING. delete: only from CONFIRMED or ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## receiptsControllerRestore

> ReceiptResponseDto receiptsControllerRestore(id)

Restore an archived receipt

ARCHIVED -&gt; CONFIRMED only — the inverse of archive.

### Example

```ts
import {
  Configuration,
  ReceiptsApi,
} from '';
import type { ReceiptsControllerRestoreRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
  } satisfies ReceiptsControllerRestoreRequest;

  try {
    const data = await api.receiptsControllerRestore(body);
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
| **id** | `string` | Receipt ID | [Defaults to `undefined`] |

### Return type

[**ReceiptResponseDto**](ReceiptResponseDto.md)

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
| **409** | extract/accept/reject-line/PATCH: only while PENDING. confirm: only from PENDING. archive: only from CONFIRMED. restore: only from ARCHIVED. cancel: only from PENDING. delete: only from CONFIRMED or ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## receiptsControllerUpdate

> ReceiptResponseDto receiptsControllerUpdate(id, updateReceiptDto)

Edit a PENDING receipt\&#39;s header fields

supplierId/docNumber/docDate/note. Not in the original scope — added to close a real gap: nothing else lets a receipt\&#39;s supplier be resolved, which POST /receipts/:id/confirm requires.

### Example

```ts
import {
  Configuration,
  ReceiptsApi,
} from '';
import type { ReceiptsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
    // UpdateReceiptDto
    updateReceiptDto: ...,
  } satisfies ReceiptsControllerUpdateRequest;

  try {
    const data = await api.receiptsControllerUpdate(body);
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
| **id** | `string` | Receipt ID | [Defaults to `undefined`] |
| **updateReceiptDto** | [UpdateReceiptDto](UpdateReceiptDto.md) |  | |

### Return type

[**ReceiptResponseDto**](ReceiptResponseDto.md)

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
| **409** | extract/accept/reject-line/PATCH: only while PENDING. confirm: only from PENDING. archive: only from CONFIRMED. restore: only from ARCHIVED. cancel: only from PENDING. delete: only from CONFIRMED or ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


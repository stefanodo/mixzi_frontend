# WasteApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**wasteControllerCancel**](WasteApi.md#wastecontrollercancel) | **PATCH** /waste/{id}/cancel | Cancel a waste record |
| [**wasteControllerCapture**](WasteApi.md#wastecontrollercapture) | **POST** /waste/capture | Report a waste record from an already-transcribed voice note or photo |
| [**wasteControllerConfirm**](WasteApi.md#wastecontrollerconfirm) | **PATCH** /waste/{id}/confirm | Confirm a waste record, consuming stock |
| [**wasteControllerCreate**](WasteApi.md#wastecontrollercreate) | **POST** /waste | Report a waste record manually |
| [**wasteControllerFindAll**](WasteApi.md#wastecontrollerfindall) | **GET** /waste | List the current tenant\&#39;s waste records |
| [**wasteControllerFindOne**](WasteApi.md#wastecontrollerfindone) | **GET** /waste/{id} | Get a waste record by ID |
| [**wasteControllerGetAnalytics**](WasteApi.md#wastecontrollergetanalytics) | **GET** /waste/analytics | Waste control analytics (CONFIRMED records only) |
| [**wasteControllerUpdate**](WasteApi.md#wastecontrollerupdate) | **PATCH** /waste/{id} | Complete or correct a DRAFT/REVIEW waste record |



## wasteControllerCancel

> WasteResponseDto wasteControllerCancel(id)

Cancel a waste record

Allowed from any status except CONFIRMED — a confirmed record already affected real stock and cannot be cancelled.

### Example

```ts
import {
  Configuration,
  WasteApi,
} from '';
import type { WasteControllerCancelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WasteApi(config);

  const body = {
    // string | Waste record ID
    id: e1a2b3c4-1234-4abc-9def-000000000400,
  } satisfies WasteControllerCancelRequest;

  try {
    const data = await api.wasteControllerCancel(body);
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
| **id** | `string` | Waste record ID | [Defaults to `undefined`] |

### Return type

[**WasteResponseDto**](WasteResponseDto.md)

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
| **409** | confirm: only allowed from DRAFT or REVIEW. cancel: not allowed once CONFIRMED (already affected real stock). |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## wasteControllerCapture

> WasteResponseDto wasteControllerCapture(captureWasteDto)

Report a waste record from an already-transcribed voice note or photo

Does a basic name match of rawText against the tenant\&#39;s items — no heavy matching, no speech recognition/OCR here (that already happened upstream, see CaptureWasteDto). Forced into REVIEW if confidence &lt; 80, no item could be matched, or quantity is unknown.

### Example

```ts
import {
  Configuration,
  WasteApi,
} from '';
import type { WasteControllerCaptureRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WasteApi(config);

  const body = {
    // CaptureWasteDto
    captureWasteDto: ...,
  } satisfies WasteControllerCaptureRequest;

  try {
    const data = await api.wasteControllerCapture(body);
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
| **captureWasteDto** | [CaptureWasteDto](CaptureWasteDto.md) |  | |

### Return type

[**WasteResponseDto**](WasteResponseDto.md)

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


## wasteControllerConfirm

> WasteResponseDto wasteControllerConfirm(id)

Confirm a waste record, consuming stock

Only allowed from DRAFT or REVIEW. Freezes costSnapshot &#x3D; quantity * (current FIFO unit cost) and consumes that stock atomically: if stock is insufficient, nothing changes and the record stays exactly as it was — a deliberate deviation from the legacy, which allowed stock to go negative on confirm (see CLAUDE.md).

### Example

```ts
import {
  Configuration,
  WasteApi,
} from '';
import type { WasteControllerConfirmRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WasteApi(config);

  const body = {
    // string | Waste record ID
    id: e1a2b3c4-1234-4abc-9def-000000000400,
  } satisfies WasteControllerConfirmRequest;

  try {
    const data = await api.wasteControllerConfirm(body);
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
| **id** | `string` | Waste record ID | [Defaults to `undefined`] |

### Return type

[**WasteResponseDto**](WasteResponseDto.md)

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
| **409** | Stock could not be fully consumed at the given location — nothing was consumed, the whole operation was rolled back (all-or-nothing)  At least one ingredient has no stock_lots with quantity_remaining &gt; 0 at the given location — no cost figure is returned, not even a partial one  This record has no itemId set (a voice/photo capture that could not match one) — resolve it before confirming  confirm: only allowed from DRAFT or REVIEW. cancel: not allowed once CONFIRMED (already affected real stock). |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## wasteControllerCreate

> WasteResponseDto wasteControllerCreate(createWasteDto)

Report a waste record manually

Always lands in DRAFT — itemId, locationId, quantity, and reason are all required, and confidence is always 100 for a manual entry.

### Example

```ts
import {
  Configuration,
  WasteApi,
} from '';
import type { WasteControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WasteApi(config);

  const body = {
    // CreateWasteDto
    createWasteDto: ...,
  } satisfies WasteControllerCreateRequest;

  try {
    const data = await api.wasteControllerCreate(body);
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
| **createWasteDto** | [CreateWasteDto](CreateWasteDto.md) |  | |

### Return type

[**WasteResponseDto**](WasteResponseDto.md)

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


## wasteControllerFindAll

> Array&lt;WasteResponseDto&gt; wasteControllerFindAll(status, locationId, itemId, reason)

List the current tenant\&#39;s waste records

Optionally filtered by status, locationId, itemId, and/or reason. Newest first.

### Example

```ts
import {
  Configuration,
  WasteApi,
} from '';
import type { WasteControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WasteApi(config);

  const body = {
    // 'DRAFT' | 'REVIEW' | 'CONFIRMED' | 'CANCELLED' (optional)
    status: status_example,
    // string (optional)
    locationId: a1b2c3d4-5678-4abc-9def-000000000010,
    // string (optional)
    itemId: b3f1c2a0-1234-4abc-9def-56789abcdef0,
    // 'Mal estado' | 'Caducado' | 'Rotura' | 'Error de producción' | 'Quemado' | 'Sobrante no reutilizable' | 'Contaminación cruzada' | 'Devolución interna' | 'Prueba / test' | 'Otro' (optional)
    reason: reason_example,
  } satisfies WasteControllerFindAllRequest;

  try {
    const data = await api.wasteControllerFindAll(body);
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
| **status** | `DRAFT`, `REVIEW`, `CONFIRMED`, `CANCELLED` |  | [Optional] [Defaults to `undefined`] [Enum: DRAFT, REVIEW, CONFIRMED, CANCELLED] |
| **locationId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **itemId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **reason** | `Mal estado`, `Caducado`, `Rotura`, `Error de producción`, `Quemado`, `Sobrante no reutilizable`, `Contaminación cruzada`, `Devolución interna`, `Prueba / test`, `Otro` |  | [Optional] [Defaults to `undefined`] [Enum: Mal estado, Caducado, Rotura, Error de producción, Quemado, Sobrante no reutilizable, Contaminación cruzada, Devolución interna, Prueba / test, Otro] |

### Return type

[**Array&lt;WasteResponseDto&gt;**](WasteResponseDto.md)

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


## wasteControllerFindOne

> WasteResponseDto wasteControllerFindOne(id)

Get a waste record by ID

### Example

```ts
import {
  Configuration,
  WasteApi,
} from '';
import type { WasteControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WasteApi(config);

  const body = {
    // string | Waste record ID
    id: e1a2b3c4-1234-4abc-9def-000000000400,
  } satisfies WasteControllerFindOneRequest;

  try {
    const data = await api.wasteControllerFindOne(body);
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
| **id** | `string` | Waste record ID | [Defaults to `undefined`] |

### Return type

[**WasteResponseDto**](WasteResponseDto.md)

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


## wasteControllerGetAnalytics

> WasteAnalyticsResponseDto wasteControllerGetAnalytics(from, to, locationId)

Waste control analytics (CONFIRMED records only)

Total money lost, and a breakdown by item / reason / responsible user (each sorted by cost descending — the first entries are already \&quot;top by loss\&quot;), over an optional confirmedAt date range and location.

### Example

```ts
import {
  Configuration,
  WasteApi,
} from '';
import type { WasteControllerGetAnalyticsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WasteApi(config);

  const body = {
    // string | Inclusive lower bound on confirmedAt (optional)
    from: 2026-08-01T00:00:00.000Z,
    // string | Inclusive upper bound on confirmedAt (optional)
    to: 2026-08-31T23:59:59.999Z,
    // string (optional)
    locationId: a1b2c3d4-5678-4abc-9def-000000000010,
  } satisfies WasteControllerGetAnalyticsRequest;

  try {
    const data = await api.wasteControllerGetAnalytics(body);
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
| **from** | `string` | Inclusive lower bound on confirmedAt | [Optional] [Defaults to `undefined`] |
| **to** | `string` | Inclusive upper bound on confirmedAt | [Optional] [Defaults to `undefined`] |
| **locationId** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**WasteAnalyticsResponseDto**](WasteAnalyticsResponseDto.md)

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
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## wasteControllerUpdate

> WasteResponseDto wasteControllerUpdate(id, updateWasteDto)

Complete or correct a DRAFT/REVIEW waste record

Lets a human fill in what a voice/photo capture couldn\&#39;t resolve (itemId/quantity/reason) or correct a manual entry, before confirming. Not allowed once CONFIRMED or CANCELLED.

### Example

```ts
import {
  Configuration,
  WasteApi,
} from '';
import type { WasteControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WasteApi(config);

  const body = {
    // string | Waste record ID
    id: e1a2b3c4-1234-4abc-9def-000000000400,
    // UpdateWasteDto
    updateWasteDto: ...,
  } satisfies WasteControllerUpdateRequest;

  try {
    const data = await api.wasteControllerUpdate(body);
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
| **id** | `string` | Waste record ID | [Defaults to `undefined`] |
| **updateWasteDto** | [UpdateWasteDto](UpdateWasteDto.md) |  | |

### Return type

[**WasteResponseDto**](WasteResponseDto.md)

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
| **409** | confirm: only allowed from DRAFT or REVIEW. cancel: not allowed once CONFIRMED (already affected real stock). |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


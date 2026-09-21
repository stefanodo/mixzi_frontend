# ReceiptsScanningApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**receiptsControllerAcceptLine**](ReceiptsScanningApi.md#receiptscontrolleracceptline) | **POST** /receipts/{id}/lines/{extractionLineId}/accept | Accept a proposed extraction line, creating a real receipt line |
| [**receiptsControllerExtract**](ReceiptsScanningApi.md#receiptscontrollerextract) | **POST** /receipts/{id}/extract | Upload the delivery-note image and run AI extraction |
| [**receiptsControllerRejectLine**](ReceiptsScanningApi.md#receiptscontrollerrejectline) | **DELETE** /receipts/{id}/lines/{extractionLineId} | Discard a proposed extraction line without accepting it |



## receiptsControllerAcceptLine

> ReceiptLineResponseDto receiptsControllerAcceptLine(id, extractionLineId, acceptExtractionLineDto)

Accept a proposed extraction line, creating a real receipt line

Resolves the item via itemId (existing) or createNewItem + newItem (opt-in creation, never automatic — same as the legacy). quantity/unitPrice can be edited from what was extracted.

### Example

```ts
import {
  Configuration,
  ReceiptsScanningApi,
} from '';
import type { ReceiptsControllerAcceptLineRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsScanningApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
    // string | Receipt extraction line ID
    extractionLineId: e5f6a7b8-1234-4abc-9def-000000000900,
    // AcceptExtractionLineDto
    acceptExtractionLineDto: ...,
  } satisfies ReceiptsControllerAcceptLineRequest;

  try {
    const data = await api.receiptsControllerAcceptLine(body);
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
| **extractionLineId** | `string` | Receipt extraction line ID | [Defaults to `undefined`] |
| **acceptExtractionLineDto** | [AcceptExtractionLineDto](AcceptExtractionLineDto.md) |  | |

### Return type

[**ReceiptLineResponseDto**](ReceiptLineResponseDto.md)

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
| **404** | Does not exist, or does not belong to the user\&#39;s tenant  Does not exist, or does not belong to this receipt/the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **409** | This extraction line was already accepted or rejected  extract/accept/reject-line/PATCH: only while PENDING. confirm: only from PENDING. archive: only from CONFIRMED. restore: only from ARCHIVED. cancel: only from PENDING. delete: only from CONFIRMED or ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## receiptsControllerExtract

> ReceiptExtractionRunResponseDto receiptsControllerExtract(id, file)

Upload the delivery-note image and run AI extraction

Uploads via the generic Document Extraction service, then creates a new extraction run with its proposed lines (all starting reviewStatus&#x3D;PENDING). Only allowed while the receipt is PENDING. Can be called again (e.g. with a clearer photo) — each call creates a new run.

### Example

```ts
import {
  Configuration,
  ReceiptsScanningApi,
} from '';
import type { ReceiptsControllerExtractRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsScanningApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
    // Blob
    file: BINARY_DATA_HERE,
  } satisfies ReceiptsControllerExtractRequest;

  try {
    const data = await api.receiptsControllerExtract(body);
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
| **file** | `Blob` |  | [Defaults to `undefined`] |

### Return type

[**ReceiptExtractionRunResponseDto**](ReceiptExtractionRunResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **400** | The request body failed validation (missing field, wrong type, disallowed value, ...). &#x60;fields&#x60; details each violation: &#x60;field&#x60; is the property name (dot-path if nested), &#x60;code&#x60; a stable identifier of the error type — see FieldErrorCode in src/common/errors/field-error-codes.ts. |  -  |
| **401** | The JWT is missing, invalid, or expired |  -  |
| **403** | The tenant\&#39;s plan does not include this feature  The authenticated user does not have a tenant assigned yet |  -  |
| **404** | Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **409** | extract/accept/reject-line/PATCH: only while PENDING. confirm: only from PENDING. archive: only from CONFIRMED. restore: only from ARCHIVED. cancel: only from PENDING. delete: only from CONFIRMED or ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |
| **502** | The AI provider call failed, or returned output that could not be parsed  Supabase Storage upload or signed-URL request failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## receiptsControllerRejectLine

> ReceiptExtractionLineResponseDto receiptsControllerRejectLine(id, extractionLineId)

Discard a proposed extraction line without accepting it

Sets reviewStatus&#x3D;REJECTED — the row stays as a record of what was proposed and dismissed.

### Example

```ts
import {
  Configuration,
  ReceiptsScanningApi,
} from '';
import type { ReceiptsControllerRejectLineRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReceiptsScanningApi(config);

  const body = {
    // string | Receipt ID
    id: f1a2b3c4-1234-4abc-9def-000000000700,
    // string | Receipt extraction line ID
    extractionLineId: e5f6a7b8-1234-4abc-9def-000000000900,
  } satisfies ReceiptsControllerRejectLineRequest;

  try {
    const data = await api.receiptsControllerRejectLine(body);
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
| **extractionLineId** | `string` | Receipt extraction line ID | [Defaults to `undefined`] |

### Return type

[**ReceiptExtractionLineResponseDto**](ReceiptExtractionLineResponseDto.md)

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
| **404** | Does not exist, or does not belong to this receipt/the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **409** | This extraction line was already accepted or rejected  extract/accept/reject-line/PATCH: only while PENDING. confirm: only from PENDING. archive: only from CONFIRMED. restore: only from ARCHIVED. cancel: only from PENDING. delete: only from CONFIRMED or ARCHIVED. |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


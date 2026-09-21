# CatalogApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**catalogControllerCreate**](CatalogApi.md#catalogcontrollercreate) | **POST** /catalog | Create an item in the current tenant\&#39;s catalog |
| [**catalogControllerFindAll**](CatalogApi.md#catalogcontrollerfindall) | **GET** /catalog | List the current tenant\&#39;s catalog items |
| [**catalogControllerFindOne**](CatalogApi.md#catalogcontrollerfindone) | **GET** /catalog/{id} | Get a catalog item by ID |
| [**catalogControllerRemove**](CatalogApi.md#catalogcontrollerremove) | **DELETE** /catalog/{id} | Deactivate a catalog item (soft delete) |
| [**catalogControllerUpdate**](CatalogApi.md#catalogcontrollerupdate) | **PATCH** /catalog/{id} | Edit fields of a catalog item |



## catalogControllerCreate

> ItemResponseDto catalogControllerCreate(createItemDto)

Create an item in the current tenant\&#39;s catalog

### Example

```ts
import {
  Configuration,
  CatalogApi,
} from '';
import type { CatalogControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CatalogApi(config);

  const body = {
    // CreateItemDto
    createItemDto: ...,
  } satisfies CatalogControllerCreateRequest;

  try {
    const data = await api.catalogControllerCreate(body);
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
| **createItemDto** | [CreateItemDto](CreateItemDto.md) |  | |

### Return type

[**ItemResponseDto**](ItemResponseDto.md)

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
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## catalogControllerFindAll

> Array&lt;ItemResponseDto&gt; catalogControllerFindAll()

List the current tenant\&#39;s catalog items

Returns only active items (is_active &#x3D; true) for the authenticated user\&#39;s tenant.

### Example

```ts
import {
  Configuration,
  CatalogApi,
} from '';
import type { CatalogControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CatalogApi(config);

  try {
    const data = await api.catalogControllerFindAll();
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

[**Array&lt;ItemResponseDto&gt;**](ItemResponseDto.md)

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


## catalogControllerFindOne

> ItemResponseDto catalogControllerFindOne(id)

Get a catalog item by ID

### Example

```ts
import {
  Configuration,
  CatalogApi,
} from '';
import type { CatalogControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CatalogApi(config);

  const body = {
    // string | Item ID
    id: b3f1c2a0-1234-4abc-9def-56789abcdef0,
  } satisfies CatalogControllerFindOneRequest;

  try {
    const data = await api.catalogControllerFindOne(body);
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
| **id** | `string` | Item ID | [Defaults to `undefined`] |

### Return type

[**ItemResponseDto**](ItemResponseDto.md)

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


## catalogControllerRemove

> ItemResponseDto catalogControllerRemove(id)

Deactivate a catalog item (soft delete)

Not a physical DELETE: sets is_active &#x3D; false. The item stops appearing in GET /catalog but still exists in the database.

### Example

```ts
import {
  Configuration,
  CatalogApi,
} from '';
import type { CatalogControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CatalogApi(config);

  const body = {
    // string | Item ID
    id: b3f1c2a0-1234-4abc-9def-56789abcdef0,
  } satisfies CatalogControllerRemoveRequest;

  try {
    const data = await api.catalogControllerRemove(body);
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
| **id** | `string` | Item ID | [Defaults to `undefined`] |

### Return type

[**ItemResponseDto**](ItemResponseDto.md)

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


## catalogControllerUpdate

> ItemResponseDto catalogControllerUpdate(id, updateItemDto)

Edit fields of a catalog item

### Example

```ts
import {
  Configuration,
  CatalogApi,
} from '';
import type { CatalogControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CatalogApi(config);

  const body = {
    // string | Item ID
    id: b3f1c2a0-1234-4abc-9def-56789abcdef0,
    // UpdateItemDto
    updateItemDto: ...,
  } satisfies CatalogControllerUpdateRequest;

  try {
    const data = await api.catalogControllerUpdate(body);
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
| **id** | `string` | Item ID | [Defaults to `undefined`] |
| **updateItemDto** | [UpdateItemDto](UpdateItemDto.md) |  | |

### Return type

[**ItemResponseDto**](ItemResponseDto.md)

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


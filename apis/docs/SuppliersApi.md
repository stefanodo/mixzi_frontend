# SuppliersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**suppliersControllerCreate**](SuppliersApi.md#supplierscontrollercreate) | **POST** /suppliers | Create a supplier in the current tenant\&#39;s catalog |
| [**suppliersControllerFindAll**](SuppliersApi.md#supplierscontrollerfindall) | **GET** /suppliers | List the current tenant\&#39;s suppliers |
| [**suppliersControllerFindOne**](SuppliersApi.md#supplierscontrollerfindone) | **GET** /suppliers/{id} | Get a supplier by ID |
| [**suppliersControllerRemove**](SuppliersApi.md#supplierscontrollerremove) | **DELETE** /suppliers/{id} | Deactivate a supplier (soft delete) |
| [**suppliersControllerUpdate**](SuppliersApi.md#supplierscontrollerupdate) | **PATCH** /suppliers/{id} | Edit fields of a supplier |



## suppliersControllerCreate

> SupplierResponseDto suppliersControllerCreate(createSupplierDto)

Create a supplier in the current tenant\&#39;s catalog

### Example

```ts
import {
  Configuration,
  SuppliersApi,
} from '';
import type { SuppliersControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SuppliersApi(config);

  const body = {
    // CreateSupplierDto
    createSupplierDto: ...,
  } satisfies SuppliersControllerCreateRequest;

  try {
    const data = await api.suppliersControllerCreate(body);
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
| **createSupplierDto** | [CreateSupplierDto](CreateSupplierDto.md) |  | |

### Return type

[**SupplierResponseDto**](SupplierResponseDto.md)

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


## suppliersControllerFindAll

> Array&lt;SupplierResponseDto&gt; suppliersControllerFindAll()

List the current tenant\&#39;s suppliers

Returns only active suppliers (is_active &#x3D; true) for the authenticated user\&#39;s tenant.

### Example

```ts
import {
  Configuration,
  SuppliersApi,
} from '';
import type { SuppliersControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SuppliersApi(config);

  try {
    const data = await api.suppliersControllerFindAll();
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

[**Array&lt;SupplierResponseDto&gt;**](SupplierResponseDto.md)

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


## suppliersControllerFindOne

> SupplierResponseDto suppliersControllerFindOne(id)

Get a supplier by ID

### Example

```ts
import {
  Configuration,
  SuppliersApi,
} from '';
import type { SuppliersControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SuppliersApi(config);

  const body = {
    // string | Supplier ID
    id: a1b2c3d4-5678-4abc-9def-000000000001,
  } satisfies SuppliersControllerFindOneRequest;

  try {
    const data = await api.suppliersControllerFindOne(body);
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
| **id** | `string` | Supplier ID | [Defaults to `undefined`] |

### Return type

[**SupplierResponseDto**](SupplierResponseDto.md)

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


## suppliersControllerRemove

> SupplierResponseDto suppliersControllerRemove(id)

Deactivate a supplier (soft delete)

Not a physical DELETE: sets is_active &#x3D; false. Existing supplier_item_prices rows for this supplier are left untouched — the supplier just stops appearing in GET /suppliers and GET /catalog/:itemId/suppliers keeps returning its price rows regardless.

### Example

```ts
import {
  Configuration,
  SuppliersApi,
} from '';
import type { SuppliersControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SuppliersApi(config);

  const body = {
    // string | Supplier ID
    id: a1b2c3d4-5678-4abc-9def-000000000001,
  } satisfies SuppliersControllerRemoveRequest;

  try {
    const data = await api.suppliersControllerRemove(body);
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
| **id** | `string` | Supplier ID | [Defaults to `undefined`] |

### Return type

[**SupplierResponseDto**](SupplierResponseDto.md)

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


## suppliersControllerUpdate

> SupplierResponseDto suppliersControllerUpdate(id, updateSupplierDto)

Edit fields of a supplier

### Example

```ts
import {
  Configuration,
  SuppliersApi,
} from '';
import type { SuppliersControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SuppliersApi(config);

  const body = {
    // string | Supplier ID
    id: a1b2c3d4-5678-4abc-9def-000000000001,
    // UpdateSupplierDto
    updateSupplierDto: ...,
  } satisfies SuppliersControllerUpdateRequest;

  try {
    const data = await api.suppliersControllerUpdate(body);
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
| **id** | `string` | Supplier ID | [Defaults to `undefined`] |
| **updateSupplierDto** | [UpdateSupplierDto](UpdateSupplierDto.md) |  | |

### Return type

[**SupplierResponseDto**](SupplierResponseDto.md)

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


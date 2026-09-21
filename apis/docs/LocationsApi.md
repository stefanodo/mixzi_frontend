# LocationsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**locationsControllerCreate**](LocationsApi.md#locationscontrollercreate) | **POST** /locations | Create a location for the current tenant |
| [**locationsControllerFindAll**](LocationsApi.md#locationscontrollerfindall) | **GET** /locations | List the current tenant\&#39;s locations |
| [**locationsControllerFindOne**](LocationsApi.md#locationscontrollerfindone) | **GET** /locations/{id} | Get a location by ID |
| [**locationsControllerRemove**](LocationsApi.md#locationscontrollerremove) | **DELETE** /locations/{id} | Deactivate a location (soft delete) |
| [**locationsControllerUpdate**](LocationsApi.md#locationscontrollerupdate) | **PATCH** /locations/{id} | Edit fields of a location |



## locationsControllerCreate

> LocationResponseDto locationsControllerCreate(createLocationDto)

Create a location for the current tenant

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { LocationsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LocationsApi(config);

  const body = {
    // CreateLocationDto
    createLocationDto: ...,
  } satisfies LocationsControllerCreateRequest;

  try {
    const data = await api.locationsControllerCreate(body);
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
| **createLocationDto** | [CreateLocationDto](CreateLocationDto.md) |  | |

### Return type

[**LocationResponseDto**](LocationResponseDto.md)

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


## locationsControllerFindAll

> Array&lt;LocationResponseDto&gt; locationsControllerFindAll()

List the current tenant\&#39;s locations

Returns only active locations (is_active &#x3D; true) for the authenticated user\&#39;s tenant.

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { LocationsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LocationsApi(config);

  try {
    const data = await api.locationsControllerFindAll();
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

[**Array&lt;LocationResponseDto&gt;**](LocationResponseDto.md)

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


## locationsControllerFindOne

> LocationResponseDto locationsControllerFindOne(id)

Get a location by ID

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { LocationsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LocationsApi(config);

  const body = {
    // string | Location ID
    id: a1b2c3d4-5678-4abc-9def-000000000010,
  } satisfies LocationsControllerFindOneRequest;

  try {
    const data = await api.locationsControllerFindOne(body);
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
| **id** | `string` | Location ID | [Defaults to `undefined`] |

### Return type

[**LocationResponseDto**](LocationResponseDto.md)

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


## locationsControllerRemove

> LocationResponseDto locationsControllerRemove(id)

Deactivate a location (soft delete)

Not a physical DELETE: sets is_active &#x3D; false. Existing stock_lots rows at this location are left untouched.

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { LocationsControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LocationsApi(config);

  const body = {
    // string | Location ID
    id: a1b2c3d4-5678-4abc-9def-000000000010,
  } satisfies LocationsControllerRemoveRequest;

  try {
    const data = await api.locationsControllerRemove(body);
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
| **id** | `string` | Location ID | [Defaults to `undefined`] |

### Return type

[**LocationResponseDto**](LocationResponseDto.md)

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


## locationsControllerUpdate

> LocationResponseDto locationsControllerUpdate(id, updateLocationDto)

Edit fields of a location

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { LocationsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new LocationsApi(config);

  const body = {
    // string | Location ID
    id: a1b2c3d4-5678-4abc-9def-000000000010,
    // UpdateLocationDto
    updateLocationDto: ...,
  } satisfies LocationsControllerUpdateRequest;

  try {
    const data = await api.locationsControllerUpdate(body);
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
| **id** | `string` | Location ID | [Defaults to `undefined`] |
| **updateLocationDto** | [UpdateLocationDto](UpdateLocationDto.md) |  | |

### Return type

[**LocationResponseDto**](LocationResponseDto.md)

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


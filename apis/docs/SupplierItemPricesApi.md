# SupplierItemPricesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**supplierItemPricesControllerCreate**](SupplierItemPricesApi.md#supplieritempricescontrollercreate) | **POST** /catalog/{itemId}/suppliers | Link an existing supplier to an item, at a price |
| [**supplierItemPricesControllerFindByItem**](SupplierItemPricesApi.md#supplieritempricescontrollerfindbyitem) | **GET** /catalog/{itemId}/suppliers | List suppliers and prices for an item |
| [**supplierItemPricesControllerRemove**](SupplierItemPricesApi.md#supplieritempricescontrollerremove) | **DELETE** /catalog/{itemId}/suppliers/{supplierId} | Unlink a supplier from an item |
| [**supplierItemPricesControllerUpdate**](SupplierItemPricesApi.md#supplieritempricescontrollerupdate) | **PATCH** /catalog/{itemId}/suppliers/{supplierId} | Update the price, conversion factor, or preferred flag |



## supplierItemPricesControllerCreate

> SupplierItemPriceResponseDto supplierItemPricesControllerCreate(itemId, createSupplierItemPriceDto)

Link an existing supplier to an item, at a price

Both the item and the supplier (dto.supplierId) must already exist and belong to the current tenant. Fails with SUPPLIER_PRICE_ALREADY_LINKED if this item/supplier pair is already linked — PATCH it instead. Setting isPreferred: true unmarks any other price row for this item that was previously preferred, in the same transaction.

### Example

```ts
import {
  Configuration,
  SupplierItemPricesApi,
} from '';
import type { SupplierItemPricesControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SupplierItemPricesApi(config);

  const body = {
    // string | Item ID
    itemId: b3f1c2a0-1234-4abc-9def-56789abcdef0,
    // CreateSupplierItemPriceDto
    createSupplierItemPriceDto: ...,
  } satisfies SupplierItemPricesControllerCreateRequest;

  try {
    const data = await api.supplierItemPricesControllerCreate(body);
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
| **itemId** | `string` | Item ID | [Defaults to `undefined`] |
| **createSupplierItemPriceDto** | [CreateSupplierItemPriceDto](CreateSupplierItemPriceDto.md) |  | |

### Return type

[**SupplierItemPriceResponseDto**](SupplierItemPriceResponseDto.md)

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
| **409** | This item is already linked to this supplier — PATCH the existing price row instead of POSTing a second one |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## supplierItemPricesControllerFindByItem

> Array&lt;SupplierItemPriceResponseDto&gt; supplierItemPricesControllerFindByItem(itemId)

List suppliers and prices for an item

Every supplier currently linked to this item, with the price they charge and the supplier data embedded — not just the supplier ID.

### Example

```ts
import {
  Configuration,
  SupplierItemPricesApi,
} from '';
import type { SupplierItemPricesControllerFindByItemRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SupplierItemPricesApi(config);

  const body = {
    // string | Item ID
    itemId: b3f1c2a0-1234-4abc-9def-56789abcdef0,
  } satisfies SupplierItemPricesControllerFindByItemRequest;

  try {
    const data = await api.supplierItemPricesControllerFindByItem(body);
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
| **itemId** | `string` | Item ID | [Defaults to `undefined`] |

### Return type

[**Array&lt;SupplierItemPriceResponseDto&gt;**](SupplierItemPriceResponseDto.md)

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


## supplierItemPricesControllerRemove

> SupplierItemPriceResponseDto supplierItemPricesControllerRemove(itemId, supplierId)

Unlink a supplier from an item

Physical delete, not a soft delete — a price link that no longer exists has no meaningful \&quot;inactive\&quot; state to preserve, unlike an item or a supplier.

### Example

```ts
import {
  Configuration,
  SupplierItemPricesApi,
} from '';
import type { SupplierItemPricesControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SupplierItemPricesApi(config);

  const body = {
    // string | Item ID
    itemId: b3f1c2a0-1234-4abc-9def-56789abcdef0,
    // string | Supplier ID
    supplierId: a1b2c3d4-5678-4abc-9def-000000000001,
  } satisfies SupplierItemPricesControllerRemoveRequest;

  try {
    const data = await api.supplierItemPricesControllerRemove(body);
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
| **itemId** | `string` | Item ID | [Defaults to `undefined`] |
| **supplierId** | `string` | Supplier ID | [Defaults to `undefined`] |

### Return type

[**SupplierItemPriceResponseDto**](SupplierItemPriceResponseDto.md)

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
| **404** | No price row exists for this item/supplier pair |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## supplierItemPricesControllerUpdate

> SupplierItemPriceResponseDto supplierItemPricesControllerUpdate(itemId, supplierId, updateSupplierItemPriceDto)

Update the price, conversion factor, or preferred flag

Setting isPreferred: true unmarks any other price row for this item that was previously preferred, in the same transaction. Cannot move this price to a different supplier — delete and recreate instead.

### Example

```ts
import {
  Configuration,
  SupplierItemPricesApi,
} from '';
import type { SupplierItemPricesControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SupplierItemPricesApi(config);

  const body = {
    // string | Item ID
    itemId: b3f1c2a0-1234-4abc-9def-56789abcdef0,
    // string | Supplier ID
    supplierId: a1b2c3d4-5678-4abc-9def-000000000001,
    // UpdateSupplierItemPriceDto
    updateSupplierItemPriceDto: ...,
  } satisfies SupplierItemPricesControllerUpdateRequest;

  try {
    const data = await api.supplierItemPricesControllerUpdate(body);
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
| **itemId** | `string` | Item ID | [Defaults to `undefined`] |
| **supplierId** | `string` | Supplier ID | [Defaults to `undefined`] |
| **updateSupplierItemPriceDto** | [UpdateSupplierItemPriceDto](UpdateSupplierItemPriceDto.md) |  | |

### Return type

[**SupplierItemPriceResponseDto**](SupplierItemPriceResponseDto.md)

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
| **404** | No price row exists for this item/supplier pair |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


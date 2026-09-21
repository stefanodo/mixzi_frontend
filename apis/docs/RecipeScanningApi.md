# RecipeScanningApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**recipeScanningControllerAcceptLine**](RecipeScanningApi.md#recipescanningcontrolleracceptline) | **POST** /recipe-scanning/{runId}/lines/{lineId}/accept | Accept a proposed ingredient line |
| [**recipeScanningControllerCommit**](RecipeScanningApi.md#recipescanningcontrollercommit) | **POST** /recipe-scanning/{runId}/commit | Commit the run, creating the real recipe |
| [**recipeScanningControllerDiscard**](RecipeScanningApi.md#recipescanningcontrollerdiscard) | **POST** /recipe-scanning/{runId}/discard | Discard the run entirely |
| [**recipeScanningControllerExtract**](RecipeScanningApi.md#recipescanningcontrollerextract) | **POST** /recipe-scanning/extract | Upload a recipe photo and run AI extraction |
| [**recipeScanningControllerFindOne**](RecipeScanningApi.md#recipescanningcontrollerfindone) | **GET** /recipe-scanning/{runId} | Get a recipe scan run by ID |
| [**recipeScanningControllerRejectLine**](RecipeScanningApi.md#recipescanningcontrollerrejectline) | **DELETE** /recipe-scanning/{runId}/lines/{lineId} | Discard a proposed ingredient line without accepting it |
| [**recipeScanningControllerUpdate**](RecipeScanningApi.md#recipescanningcontrollerupdate) | **PATCH** /recipe-scanning/{runId} | Edit the AI\&#39;s suggested header before committing |



## recipeScanningControllerAcceptLine

> RecipeExtractionLineResponseDto recipeScanningControllerAcceptLine(runId, lineId, acceptRecipeExtractionLineDto)

Accept a proposed ingredient line

Resolves the ingredient via itemId (existing item), recipeId (existing recipe, used as a subrecipe), or createNewItem + newItem (opt-in creation, never automatic). Does NOT create anything in recipes/recipe_ingredients yet — that only happens at commit, since the real recipe does not exist until then. quantityNet/wastePct are editable from what was extracted.

### Example

```ts
import {
  Configuration,
  RecipeScanningApi,
} from '';
import type { RecipeScanningControllerAcceptLineRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeScanningApi(config);

  const body = {
    // string | Recipe scan extraction run ID
    runId: d4e5f6a7-1234-4abc-9def-000000000950,
    // string | Recipe scan extraction line ID
    lineId: e5f6a7b8-1234-4abc-9def-000000000900,
    // AcceptRecipeExtractionLineDto
    acceptRecipeExtractionLineDto: ...,
  } satisfies RecipeScanningControllerAcceptLineRequest;

  try {
    const data = await api.recipeScanningControllerAcceptLine(body);
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
| **runId** | `string` | Recipe scan extraction run ID | [Defaults to `undefined`] |
| **lineId** | `string` | Recipe scan extraction line ID | [Defaults to `undefined`] |
| **acceptRecipeExtractionLineDto** | [AcceptRecipeExtractionLineDto](AcceptRecipeExtractionLineDto.md) |  | |

### Return type

[**RecipeExtractionLineResponseDto**](RecipeExtractionLineResponseDto.md)

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
| **404** | Does not exist, or does not belong to the user\&#39;s tenant  Does not exist, or does not belong to the user\&#39;s tenant  Does not exist, or does not belong to this run/the user\&#39;s tenant |  -  |
| **409** | This extraction line was already accepted or rejected  PATCH/accept/reject-line/commit/discard: only while the run is PENDING |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipeScanningControllerCommit

> RecipeResponseDto recipeScanningControllerCommit(runId)

Commit the run, creating the real recipe

PENDING -&gt; COMMITTED. Requires suggestedName and suggestedYieldPortions to be resolved (edit via PATCH first) and at least one accepted line. Atomically: creates the recipe row from the suggested header, and one recipe_ingredients row per accepted line (itemId or subrecipeId, never both, per line). Returns the newly created recipe.

### Example

```ts
import {
  Configuration,
  RecipeScanningApi,
} from '';
import type { RecipeScanningControllerCommitRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeScanningApi(config);

  const body = {
    // string | Recipe scan extraction run ID
    runId: d4e5f6a7-1234-4abc-9def-000000000950,
  } satisfies RecipeScanningControllerCommitRequest;

  try {
    const data = await api.recipeScanningControllerCommit(body);
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
| **runId** | `string` | Recipe scan extraction run ID | [Defaults to `undefined`] |

### Return type

[**RecipeResponseDto**](RecipeResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **401** | The JWT is missing, invalid, or expired |  -  |
| **403** | The tenant\&#39;s plan does not include this feature  The authenticated user does not have a tenant assigned yet |  -  |
| **404** | Does not exist, or does not belong to the user\&#39;s tenant |  -  |
| **409** | The run has no accepted lines yet — accept at least one before committing  suggestedName and/or suggestedYieldPortions are not set — resolve them via PATCH /recipe-scanning/:runId before committing  PATCH/accept/reject-line/commit/discard: only while the run is PENDING |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipeScanningControllerDiscard

> RecipeExtractionRunResponseDto recipeScanningControllerDiscard(runId)

Discard the run entirely

PENDING -&gt; DISCARDED. Creates nothing — no recipe, no recipe_ingredients.

### Example

```ts
import {
  Configuration,
  RecipeScanningApi,
} from '';
import type { RecipeScanningControllerDiscardRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeScanningApi(config);

  const body = {
    // string | Recipe scan extraction run ID
    runId: d4e5f6a7-1234-4abc-9def-000000000950,
  } satisfies RecipeScanningControllerDiscardRequest;

  try {
    const data = await api.recipeScanningControllerDiscard(body);
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
| **runId** | `string` | Recipe scan extraction run ID | [Defaults to `undefined`] |

### Return type

[**RecipeExtractionRunResponseDto**](RecipeExtractionRunResponseDto.md)

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
| **409** | PATCH/accept/reject-line/commit/discard: only while the run is PENDING |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipeScanningControllerExtract

> RecipeExtractionRunResponseDto recipeScanningControllerExtract(file)

Upload a recipe photo and run AI extraction

Uploads via the generic Document Extraction service, then creates a new draft (extraction run) with a suggested header (name/yieldPortions/prepSteps) and proposed ingredient lines, each auto-matched against your existing items AND recipes. Unlike Receipts, there is no separate \&quot;create\&quot; step — this call both starts the draft and extracts into it.

### Example

```ts
import {
  Configuration,
  RecipeScanningApi,
} from '';
import type { RecipeScanningControllerExtractRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeScanningApi(config);

  const body = {
    // Blob
    file: BINARY_DATA_HERE,
  } satisfies RecipeScanningControllerExtractRequest;

  try {
    const data = await api.recipeScanningControllerExtract(body);
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
| **file** | `Blob` |  | [Defaults to `undefined`] |

### Return type

[**RecipeExtractionRunResponseDto**](RecipeExtractionRunResponseDto.md)

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
| **429** | The allowed request limit for this endpoint was exceeded |  -  |
| **502** | The AI provider call failed, or returned output that could not be parsed  Supabase Storage upload or signed-URL request failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipeScanningControllerFindOne

> RecipeExtractionRunResponseDto recipeScanningControllerFindOne(runId)

Get a recipe scan run by ID

Includes the suggested header and every proposed ingredient line, in any reviewStatus.

### Example

```ts
import {
  Configuration,
  RecipeScanningApi,
} from '';
import type { RecipeScanningControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeScanningApi(config);

  const body = {
    // string | Recipe scan extraction run ID
    runId: d4e5f6a7-1234-4abc-9def-000000000950,
  } satisfies RecipeScanningControllerFindOneRequest;

  try {
    const data = await api.recipeScanningControllerFindOne(body);
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
| **runId** | `string` | Recipe scan extraction run ID | [Defaults to `undefined`] |

### Return type

[**RecipeExtractionRunResponseDto**](RecipeExtractionRunResponseDto.md)

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


## recipeScanningControllerRejectLine

> RecipeExtractionLineResponseDto recipeScanningControllerRejectLine(runId, lineId)

Discard a proposed ingredient line without accepting it

Sets reviewStatus&#x3D;REJECTED — the row stays as a record of what was proposed and dismissed.

### Example

```ts
import {
  Configuration,
  RecipeScanningApi,
} from '';
import type { RecipeScanningControllerRejectLineRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeScanningApi(config);

  const body = {
    // string | Recipe scan extraction run ID
    runId: d4e5f6a7-1234-4abc-9def-000000000950,
    // string | Recipe scan extraction line ID
    lineId: e5f6a7b8-1234-4abc-9def-000000000900,
  } satisfies RecipeScanningControllerRejectLineRequest;

  try {
    const data = await api.recipeScanningControllerRejectLine(body);
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
| **runId** | `string` | Recipe scan extraction run ID | [Defaults to `undefined`] |
| **lineId** | `string` | Recipe scan extraction line ID | [Defaults to `undefined`] |

### Return type

[**RecipeExtractionLineResponseDto**](RecipeExtractionLineResponseDto.md)

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
| **404** | Does not exist, or does not belong to this run/the user\&#39;s tenant |  -  |
| **409** | This extraction line was already accepted or rejected  PATCH/accept/reject-line/commit/discard: only while the run is PENDING |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recipeScanningControllerUpdate

> RecipeExtractionRunResponseDto recipeScanningControllerUpdate(runId, updateRecipeExtractionRunDto)

Edit the AI\&#39;s suggested header before committing

suggestedName/suggestedYieldPortions/suggestedPrepSteps. Only allowed while the run is PENDING.

### Example

```ts
import {
  Configuration,
  RecipeScanningApi,
} from '';
import type { RecipeScanningControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RecipeScanningApi(config);

  const body = {
    // string | Recipe scan extraction run ID
    runId: d4e5f6a7-1234-4abc-9def-000000000950,
    // UpdateRecipeExtractionRunDto
    updateRecipeExtractionRunDto: ...,
  } satisfies RecipeScanningControllerUpdateRequest;

  try {
    const data = await api.recipeScanningControllerUpdate(body);
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
| **runId** | `string` | Recipe scan extraction run ID | [Defaults to `undefined`] |
| **updateRecipeExtractionRunDto** | [UpdateRecipeExtractionRunDto](UpdateRecipeExtractionRunDto.md) |  | |

### Return type

[**RecipeExtractionRunResponseDto**](RecipeExtractionRunResponseDto.md)

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
| **409** | PATCH/accept/reject-line/commit/discard: only while the run is PENDING |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


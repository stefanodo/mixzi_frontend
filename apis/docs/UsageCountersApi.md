# UsageCountersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**usageCountersControllerFindCurrentPeriod**](UsageCountersApi.md#usagecounterscontrollerfindcurrentperiod) | **GET** /usage-counters | List the current tenant\&#39;s AI usage counters |



## usageCountersControllerFindCurrentPeriod

> Array&lt;UsageCounterResponseDto&gt; usageCountersControllerFindCurrentPeriod(period)

List the current tenant\&#39;s AI usage counters

Always returns one entry per known counter_key (receipt_scans, recipe_scans), defaulting count to 0 for a key unused this period. Measured only — nothing here blocks a request; see CLAUDE.md.

### Example

```ts
import {
  Configuration,
  UsageCountersApi,
} from '';
import type { UsageCountersControllerFindCurrentPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsageCountersApi(config);

  const body = {
    // 'current' | Which billing period to report. Only \"current\" exists today. (optional)
    period: period_example,
  } satisfies UsageCountersControllerFindCurrentPeriodRequest;

  try {
    const data = await api.usageCountersControllerFindCurrentPeriod(body);
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
| **period** | `current` | Which billing period to report. Only \&quot;current\&quot; exists today. | [Optional] [Defaults to `&#39;current&#39;`] [Enum: current] |

### Return type

[**Array&lt;UsageCounterResponseDto&gt;**](UsageCounterResponseDto.md)

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
| **403** | The authenticated user does not have a tenant assigned yet |  -  |
| **429** | The allowed request limit for this endpoint was exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


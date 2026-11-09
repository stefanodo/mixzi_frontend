import ApiService from '@/api/ApiService'
import { authStore } from '@/stores/AuthStore'
import StockStore from './StockStore';
import CatalogStore from './CatalogStore';
import { StockLotsApi } from '@/_generated/apis/StockLotsApi';
import { CatalogApi } from '@/_generated/apis/CatalogApi';
import { MIXZI_API_BASE } from '@/config/envVariables';
import { Configuration as MixziConfig } from '@/_generated';

export default class Main {
  authStore = authStore;
  stockStore: StockStore;
  catalogStore: CatalogStore;
  apiService: ApiService;
  mixziConfig: MixziConfig;
  stockLotsApi: StockLotsApi;
  catalogApi: CatalogApi;

  constructor() {
    this.apiService = new ApiService(this.authStore);
    this.stockStore = new StockStore();
    this.catalogStore = new CatalogStore();
    this.mixziConfig = new MixziConfig({ basePath: MIXZI_API_BASE, accessToken: this.authStore.getValidAccessToken });
    this.stockLotsApi = new StockLotsApi(this.mixziConfig);
    this.catalogApi = new CatalogApi(this.mixziConfig);
  }

  init() {
    this.stockStore.init(this.stockLotsApi);
    this.catalogStore.init(this.catalogApi);
  }
}


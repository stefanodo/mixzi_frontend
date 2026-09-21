import ApiService from '@/api/ApiService'
import AuthStore from '@/stores/AuthStore'
import StockStore from './StockStore';
import { StockLotsApi } from '@/_generated/apis/StockLotsApi';
import { MIXZI_API_BASE } from '@/config/envVariables';
import { Configuration as MixziConfig } from '@/_generated';

export default class Main {
  authStore: AuthStore;
  stockStore: StockStore;
  apiService: ApiService;
  mixziConfig: MixziConfig;
  stockLotsApi: StockLotsApi;

  constructor() {
    this.authStore = new AuthStore();
    this.apiService = new ApiService(this.authStore);
    this.stockStore = new StockStore();
    this.mixziConfig = new MixziConfig({ basePath: MIXZI_API_BASE });
    this.stockLotsApi = new StockLotsApi(this.mixziConfig);
  }

  init() {
    this.authStore.init(this.apiService);
    this.stockStore.init(this.stockLotsApi);
  }
}



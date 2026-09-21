import ApiService from '@/api/ApiService'
import AuthStore from '@/stores/AuthStore'

export default class Main {
  authStore: AuthStore;

  apiService: ApiService;

  constructor() {
    this.authStore = new AuthStore();
    this.apiService = new ApiService(this.authStore);
  }
  init() {
    this.authStore.init(this.apiService);
  }
}



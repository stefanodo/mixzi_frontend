import type { StockLotResponseDto, StockLotsApi } from "@/_generated";
import { MOCKED_STOCK_LOT_REFERENCES } from "@/mocks/stockMocks";
import { makeObservable, observable, runInAction } from "mobx";

export default class StockStore {
    stockLotReferences: StockLotResponseDto[] = [];
    fetchingStockLots: boolean = false;

    stockLotsApi?: StockLotsApi;

    constructor() {
        makeObservable(this, {
            stockLotReferences: observable,
            stockLotsApi: observable,
            fetchingStockLots: observable,
        })

        runInAction(() => {
            this.stockLotReferences = MOCKED_STOCK_LOT_REFERENCES;
        });
    }

    init = (
        stockLotsApi: StockLotsApi,
    ) => {
        this.stockLotsApi = stockLotsApi;
    }

    setFetchingStockLots = (value: boolean) => {
        this.fetchingStockLots = value;
    }

    fetchStockLots = async () => {
        this.setFetchingStockLots(true);

        try {
            const newresponse = await this.stockLotsApi?.stockLotsControllerFindAll();
            runInAction(() => (this.stockLotReferences = newresponse ?? MOCKED_STOCK_LOT_REFERENCES))
        } catch {
            runInAction(() => {
                if (!this.stockLotReferences.length) {
                    this.stockLotReferences = MOCKED_STOCK_LOT_REFERENCES;
                }
            });
        } finally {
            this.setFetchingStockLots(false);
        }
    }

}
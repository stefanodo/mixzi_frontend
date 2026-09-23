import type { StockLotResponseDto, StockLotsApi } from "@/_generated";
import { MOCKED_STOCK_LOT_REFERENCES } from "@/mocks/stockMocks";
import { makeObservable, observable, runInAction } from "mobx";

export default class StockStore {
    stockLotReferences: StockLotResponseDto[] = [];
    fetchingStockLots: boolean = false;
    stockLotsError: string | null = null;

    stockLotsApi?: StockLotsApi;

    constructor() {
        makeObservable(this, {
            stockLotReferences: observable,
            stockLotsApi: observable,
            fetchingStockLots: observable,
            stockLotsError: observable,
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

    setStockLotsError = (value: string | null) => {
        this.stockLotsError = value;
    }

    fetchStockLots = async () => {
        this.setFetchingStockLots(true);
        this.setStockLotsError(null);

        try {
            const newresponse = await this.stockLotsApi?.stockLotsControllerFindAll();
            runInAction(() => (this.stockLotReferences = newresponse ?? MOCKED_STOCK_LOT_REFERENCES))
        } catch {
            runInAction(() => {
                this.setStockLotsError("No se pudo cargar el stock. Se muestran datos de ejemplo.");
                if (!this.stockLotReferences.length) {
                    this.stockLotReferences = MOCKED_STOCK_LOT_REFERENCES;
                }
            });
        } finally {
            this.setFetchingStockLots(false);
        }
    }

}
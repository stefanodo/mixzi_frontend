import type { CatalogApi, ItemResponseDto, StockLotsApi } from "@/_generated";
import { MOCKED_CATALOG_REFERENCES } from "@/mocks/catalogMocks";
import { makeObservable, observable, runInAction } from "mobx";

export default class CatalogStore {
    catalogReferences: ItemResponseDto[] = [];
    fetchingCatalog: boolean = false;
    catalogError: string | null = null;

    catalogApi?: CatalogApi;

    constructor() {
        makeObservable(this, {
            catalogReferences: observable,
            catalogApi: observable,
            fetchingCatalog: observable,
            catalogError: observable,
        })

        runInAction(() => {
            this.catalogReferences = MOCKED_CATALOG_REFERENCES;
        });
    }

    init = (
        catalogApi: CatalogApi,
    ) => {
        this.catalogApi = catalogApi;
    }

    setFetchingCatalog = (value: boolean) => {
        this.fetchingCatalog = value;
    }

    setCatalogError = (value: string | null) => {
        this.catalogError = value;
    }

    fetchCatalog = async () => {
        this.setFetchingCatalog(true);
        this.setCatalogError(null);

        try {
            const newresponse = await this.catalogApi?.catalogControllerFindAll();
            runInAction(() => (this.catalogReferences = newresponse ?? MOCKED_CATALOG_REFERENCES))
        } catch {
            runInAction(() => {
                this.setCatalogError("No se pudo cargar el catálogo. Se muestran datos de ejemplo.");
                if (!this.catalogReferences.length) {
                    this.catalogReferences = MOCKED_CATALOG_REFERENCES;
                }
            });
        } finally {
            this.setFetchingCatalog(false);
        }
    }

}
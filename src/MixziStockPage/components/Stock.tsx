import { useMainStore } from "@/context/MainContext";
import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import type { StockLotResponseDto } from "@/_generated";

export const Stock = observer(() => {
    const {
        stockStore: {
            stockLotReferences,
            fetchingStockLots,
            fetchStockLots,
        }
    } = useMainStore();

    useEffect(() => {
        fetchStockLots();
    }, [fetchStockLots]);

    const columns = useMemo<DataGridColumn<StockLotResponseDto>[]>(() => [
        {
            accessorKey: "id",
            header: "ID",
            enableSorting: true,
        },
        {
            accessorKey: "itemId",
            header: "Item",
            enableSorting: true,
        },
        {
            accessorKey: "locationId",
            header: "Location",
            enableSorting: true,
        },
        {
            accessorKey: "supplierId.supplierName",
            header: "Supplier",
            enableSorting: true,
        },
        {
            accessorKey: "quantityReceived",
            header: "Received",
            enableSorting: true,
        },
        {
            accessorKey: "quantityRemaining",
            header: "Remaining",
            enableSorting: true,
        },
        {
            accessorKey: "unitCost",
            header: "Unit Cost",
            cell: ({ row }) => `$${Number(row.original.unitCost ?? 0).toFixed(2)}`,
            enableSorting: true,
        },
        {
            accessorKey: "receivedAt",
            header: "Received At",
            cell: ({ row }) => new Date(row.original.receivedAt).toLocaleString(),
            enableSorting: true,
        }
    ], []);

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Stock</h2>
                    <p className="text-sm text-muted-foreground">Current stock lots</p>
                </div>
            </div>

            <DataGrid
                data={stockLotReferences}
                columns={columns}
                loading={fetchingStockLots}
                emptyMessage="No stock lots available."
                ariaLabel="Stock lots table"
                pageSize={5}
                showPagination
                getRowId={(row) => row.id}
            />
        </section>
    );
});
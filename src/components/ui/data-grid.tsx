import {
  type ColumnDef,
  createSortedRowModel,
  flexRender,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import {
  Fragment,
  type KeyboardEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dataGridFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

export type DataGridColumn<TData extends object> = ColumnDef<
  typeof dataGridFeatures,
  TData,
  unknown
>;

export type DataGridProps<TData extends object> = {
  data: TData[];
  columns: DataGridColumn<TData>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  ariaLabel?: string;
  pageSize?: number;
  showPagination?: boolean;
  getRowId?: (row: TData, index: number) => string;
  renderExpandedRow?: (row: TData) => ReactNode;
};

export function DataGrid<TData extends object>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available.",
  className,
  ariaLabel = "Data grid",
  pageSize = 10,
  showPagination = true,
  getRowId,
  renderExpandedRow,
}: DataGridProps<TData>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set());

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  const paginatedData = useMemo(() => {
    if (!showPagination || data.length <= pageSize) {
      return data;
    }

    const start = safePage * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, pageSize, safePage, showPagination]);

  const table = useTable({
    data: loading ? [] : paginatedData,
    columns,
    features: dataGridFeatures,
    state: { sorting },
    onSortingChange: setSorting,
  });

  const resolveRowId = (row: TData, index: number) => {
    if (getRowId) return getRowId(row, index);

    const candidate = (row as Record<string, unknown>)?.id;
    return typeof candidate === "string" || typeof candidate === "number"
      ? String(candidate)
      : `row-${index}`;
  };

  const toggleExpanded = (rowId: string) => {
    setExpandedRows((current) => {
      const next = new Set(current);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.stopPropagation();
    }
  };

  const renderSkeletonTable = () => (
    <div className={cn("overflow-hidden rounded-md border bg-background", className)} role="status" aria-live="polite" aria-atomic="true">
      <Table aria-label={ariaLabel} aria-busy="true">
        <TableHeader>
          <TableRow>
            {columns.map((_, index) => (
              <TableHead key={`loading-header-${index}`}>
                <div className="h-4 w-24 rounded bg-muted/80" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <TableRow key={`loading-row-${rowIndex}`}>
              {columns.map((_, cellIndex) => (
                <TableCell key={`loading-cell-${rowIndex}-${cellIndex}`}>
                  <div className="h-4 w-full rounded bg-muted/80" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return renderSkeletonTable();
  }

  if (!data.length) {
    return (
      <div
        className={cn(
          "flex min-h-40 items-center justify-center rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground",
          className
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {emptyMessage}
      </div>
    );
  }

  const startIndex = showPagination ? safePage * pageSize + 1 : 1;
  const endIndex = showPagination ? Math.min((safePage + 1) * pageSize, data.length) : data.length;

  return (
    <div className={cn("overflow-hidden rounded-md border bg-background", className)}>
      <Table aria-label={ariaLabel}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="size-8"
                          aria-label={`Sort by ${String(header.column.columnDef.header)}`}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={handleButtonKeyDown}
                        >
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp aria-hidden="true" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown aria-hidden="true" />
                          ) : (
                            <ArrowUpDown aria-hidden="true" />
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, rowIndex) => {
            const rowId = resolveRowId(row.original as TData, rowIndex);
            const isExpanded = expandedRows.has(rowId);
            const expandedContentId = `expanded-${rowId}`;

            return (
              <Fragment key={rowId}>
                <TableRow>
                  {renderExpandedRow && (
                    <TableCell className="w-12 pr-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={isExpanded ? "Collapse row" : "Expand row"}
                        aria-expanded={isExpanded}
                        aria-controls={expandedContentId}
                        onClick={() => toggleExpanded(rowId)}
                        onKeyDown={handleButtonKeyDown}
                      >
                        {isExpanded ? "−" : "+"}
                      </Button>
                    </TableCell>
                  )}
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {isExpanded && (
                  <TableRow>
                    <TableCell
                      colSpan={row.getAllCells().length + 1}
                      className="bg-muted/20 p-0"
                    >
                      <div
                        id={expandedContentId}
                        role="region"
                        aria-label={`${ariaLabel} details`}
                      >
                        {renderExpandedRow?.(row.original as TData)}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>

      {showPagination && (
        <div className="flex items-center justify-between gap-3 border-t bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
          <div role="status" aria-live="polite" aria-atomic="true">
            Showing {startIndex}-{endIndex} of {data.length}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((current) => Math.max(0, current - 1))}
              onKeyDown={handleButtonKeyDown}
              disabled={safePage === 0}
            >
              Previous
            </Button>
            <span className="min-w-16 text-center text-foreground">
              Page {safePage + 1}/{totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((current) => Math.min(totalPages - 1, current + 1))}
              onKeyDown={handleButtonKeyDown}
              disabled={safePage >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

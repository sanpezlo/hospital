"use client";

import {
  Dispatch,
  Key,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import {
  Table as NextuiTable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
  SortDescriptor,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Select,
  SelectItem,
  Pagination,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { action } from "@/lib/parse";

interface Column {
  key: Key;
  label: string;
  sortable: boolean;
}

interface Row {
  [key: string]: any;
}

export default function Table({
  className = "",
  ariaLabel,
  renderCell,
  columns,
  INITIAL_VISIBLE_COLUMNS,
  rows,
  filterOptions = {},
  actions = undefined,
  isLoading = false,
  title,
  filterSearch = undefined,
  searchBy = "",
  onPressAdd = undefined,
  AddButton = <></>,
}: {
  className?: string;
  ariaLabel: string;
  renderCell: (item: Row, columnKey: Key) => any;
  columns: Column[];
  INITIAL_VISIBLE_COLUMNS: string[];
  rows: Row[];
  filterOptions?: {
    [key: string]: {
      name: string;
      options: { key: string; name: string }[];
    };
  };
  actions?: {
    view?: (item: any) => void;
    edit?: (item: any) => void;
    delete?: (item: any) => void;
    approve?: (item: any) => void;
    reapprove?: (item: any) => void;
    complete?: (item: any) => void;
    remove?: (item: any) => void;
  };
  isLoading?: boolean;
  title: string;
  filterSearch?: (filtered: any[], filterValue: string) => any[];
  searchBy?: string;
  onPressAdd?: () => void;
  AddButton?: ReactNode;
}) {
  columns = Boolean(actions)
    ? [...columns, { key: "actions", label: "ACCIONES", sortable: false }]
    : columns;

  INITIAL_VISIBLE_COLUMNS = Boolean(actions)
    ? [...INITIAL_VISIBLE_COLUMNS, "actions"]
    : INITIAL_VISIBLE_COLUMNS;

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [filterValue, setFilterValue] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [rowsPerPage, setRowsPerPage] = useState<Selection>(new Set(["5"]));
  const [page, setPage] = useState(1);

  const [filter, setFilter] = useState<{ [key: string]: Selection }>(
    Object.keys(filterOptions).reduce(
      (acc, key) => ({ ...acc, [key]: "all" }),
      {}
    )
  );
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.key)
    );
  }, [columns, visibleColumns]);

  const filteredItems = useMemo(() => {
    let filtered = [...rows];

    if (Boolean(filterValue) && filterSearch !== undefined) {
      filtered = filterSearch(filtered, filterValue);
    }

    Object.keys(filter).forEach((key) => {
      const filterValue = filter[key];

      if (
        filterValue !== "all" &&
        Array.from(filterValue).length !== filterOptions[key].options.length
      ) {
        filtered = filtered.filter((filter) =>
          Array.from(filterValue).includes(filter[key])
        );
      }
    });

    return filtered;
  }, [rows, filterValue, filterSearch, filter, filterOptions]);

  const pages = Math.ceil(
    filteredItems.length /
      (rowsPerPage === "all"
        ? filteredItems.length
        : rowsPerPage.values().next().value)
  );

  const items = useMemo(() => {
    if (rowsPerPage === "all") return filteredItems;

    const start = (page - 1) * rowsPerPage.values().next().value;
    const end = start + rowsPerPage.values().next().value;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof object] as number;
      const second = b[sortDescriptor.column as keyof object] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  return (
    <NextuiTable
      className={className}
      isHeaderSticky
      aria-label={ariaLabel}
      selectionMode="single"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
      topContent={
        <TopContent
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          filteredItems={filteredItems}
          filter={filter}
          setFilter={setFilter}
          filterOptions={filterOptions}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          columns={columns}
          title={title}
          isSearch={filterSearch !== undefined}
          searchBy={searchBy}
          onPressAdd={onPressAdd}
          AddButton={AddButton}
        />
      }
      bottomContent={
        <BottomContent
          selectedKeys={selectedKeys}
          page={page}
          pages={pages}
          setPage={setPage}
          filteredItems={filteredItems}
        />
      }
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={column.sortable}
            align={column.key === "actions" ? "center" : "start"}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={sortedItems}
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "actions" ? (
                  <div className="relative flex justify-end items-center gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <EllipsisVerticalIcon className="text-default-300 w-6" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        onAction={(key) => {
                          if (
                            actions &&
                            typeof actions[key as keyof typeof actions] ===
                              "function"
                          ) {
                            actions[key as keyof typeof actions]?.(item);
                          }
                        }}
                      >
                        {Object.keys(actions || {}).map((key) => (
                          <DropdownItem
                            key={key}
                            color={key === "delete" ? "danger" : "default"}
                            className={key === "delete" ? "text-danger" : ""}
                          >
                            {action(key as keyof typeof actions)}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                ) : (
                  renderCell(item, columnKey)
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </NextuiTable>
  );
}

function TopContent({
  filterValue,
  setFilterValue,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  filteredItems,
  filter,
  setFilter,
  filterOptions,
  visibleColumns,
  setVisibleColumns,
  columns,
  title,
  onPressAdd = undefined,
  isSearch = false,
  searchBy = "",
  AddButton = <></>,
}: {
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: Selection;
  setRowsPerPage: Dispatch<SetStateAction<Selection>>;
  filteredItems: any[];
  filter: { [key: string]: Selection };
  setFilter: Dispatch<SetStateAction<{ [key: string]: Selection }>>;
  filterOptions: {
    [key: string]: {
      name: string;
      options: { key: string; name: string }[];
    };
  };
  visibleColumns: Selection;
  setVisibleColumns: Dispatch<SetStateAction<Selection>>;
  columns: Column[];
  title: string;
  onPressAdd?: () => void;
  isSearch?: boolean;
  searchBy?: string;
  AddButton?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-md">{title}</h2>
      <div className="flex justify-between gap-3 items-end flex-wrap">
        {isSearch && (
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={`Buscar ${searchBy}`}
            startContent={<MagnifyingGlassIcon className="w-4" />}
            value={filterValue}
            onClear={() => {
              setFilterValue("");
              setPage(1);
            }}
            onValueChange={(value) => {
              if (value) {
                setFilterValue(value);
              } else {
                setFilterValue("");
              }
              setPage(1);
            }}
          />
        )}
        <div className="flex gap-3 flex-wrap">
          {Object.keys(filterOptions).map((key) => (
            <Dropdown key={key}>
              <DropdownTrigger className="flex">
                <Button
                  endContent={<ChevronDownIcon className="w-4" />}
                  variant="flat"
                >
                  {filterOptions[key].name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={filter[key]}
                selectionMode="multiple"
                onSelectionChange={(value) => {
                  if (value === "all" || value.size === 0) return;
                  setFilter((prev) => ({ ...prev, [key]: value }));
                }}
              >
                {filterOptions[key].options.map((option) => (
                  <DropdownItem key={option.key} className="capitalize">
                    {option.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          ))}

          <Dropdown>
            <DropdownTrigger className="flex">
              <Button
                endContent={<ChevronDownIcon className="w-4" />}
                variant="flat"
              >
                Columnas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.key} className="capitalize">
                  {column.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {Boolean(onPressAdd) && (
            <Button
              color="primary"
              endContent={<PlusIcon className="w-6" />}
              onPress={onPressAdd}
            >
              Agregar
            </Button>
          )}

          {Boolean(AddButton) && AddButton}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {filteredItems.length} filas
        </span>

        <Select
          variant="underlined"
          label="Filas por página"
          className="max-w-xs"
          onSelectionChange={(value) => {
            if (value === "all" || value.size === 0) return;
            setRowsPerPage(value);
          }}
          selectedKeys={rowsPerPage}
        >
          {["5", "10", "15"].map((i) => (
            <SelectItem key={i} value={i}>
              {i}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}

function BottomContent({
  selectedKeys,
  page,
  pages,
  setPage,
  filteredItems,
}: {
  selectedKeys: Selection;
  page: number;
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
  filteredItems: any[];
}) {
  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <span className="w-[30%] text-small text-default-400">
        {selectedKeys === "all"
          ? "Todas las filas seleccionadas"
          : `${selectedKeys.size} de ${filteredItems.length} seleccionadas`}
      </span>
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages || 1}
        onChange={setPage}
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button
          isDisabled={pages === 0 || pages === 1}
          size="sm"
          variant="flat"
          onPress={() => {
            if (page > 1) setPage(page - 1);
          }}
        >
          Anterior
        </Button>
        <Button
          isDisabled={pages === 0 || pages === 1}
          size="sm"
          variant="flat"
          onPress={() => {
            if (page < pages) setPage(page + 1);
          }}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

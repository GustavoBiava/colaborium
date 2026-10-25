import { DataTable } from "@/shared/components/DataTable";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";

import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
  type SortingState,
} from "@tanstack/react-table";
import { Pen, Plus, Trash, User } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { ClientDialog } from "./components/ClientDialog";

// here we are using tanstack table, beacuse we already plan to use tanstack query. Basically the advantage of using tanstack table is that it already has some data tables logics built in, like sorting, pagination, global filters, etc. And its headless, so we can use our own UI
// here is a video about it https://www.youtube.com/watch?v=GtT3mRjQ7Eo

type User = { id: string; name: string; email: string };

const data: User[] = [
  { id: "1", name: "Maria", email: "maria@procer.com.br" },
  { id: "2", name: "João", email: "joao@procer.com.br" },
];

// this feature thing is pretty badass, cause basically v8 version you called the whole thing, even thoght you were not going to use it all, so know you declare features so you choose whatever you wanna use, its modular and tree-shakeable
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});

const helper = createColumnHelper<typeof features, User>();
// From what I understand, this is to avoid typing error. You kind of merge the data and the functions, so typescript knows what columns and features are available .

export function Clients() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [upsertCard, setUpsertCard] = useState<boolean>(false);
  const [_params, setParams] = useSearchParams();

  // here we define columns obviously
  const columns = helper.columns([
    helper.accessor("name", { header: "Nome" }),
    helper.accessor("email", { header: "E-mail" }),
    helper.display({
      id: "actions",
      header: "Ações",
      cell: () => (
        <div className="flex justify-end items-center">
          <Button
            onClick={() => {
              setParams({ mode: "update" });
              setUpsertCard(true);
            }}
            className="bg-white hover:bg-neutral-200 px-2.5"
          >
            <Pen color="black" />
          </Button>
          <Button className="bg-white hover:bg-neutral-200 px-2.5">
            <Trash color="black" />
          </Button>
        </div>
      ),
    }),
  ]);

  // here you basically join the whole things, the features, the columns, the data and the state
  const table = useTable({
    features,
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <PageLayout
      pageTitle="Clientes"
      Icon={User}
      subtitle="Gerencie seus clientes"
    >
      <div className="flex flex-col gap-5 ">
        <div className="flex flex-col gap-5 w-full items-end">
          <Button
            onClick={() => {
              setUpsertCard(true);
              setParams({ mode: "create" });
            }}
            className="w-36"
          >
            <Plus size={18} />
            <p>Cliente</p>
          </Button>
        </div>

        <DataTable table={table} />
      </div>
      <p>{upsertCard}</p>

      {upsertCard && <ClientDialog open={upsertCard} setOpen={setUpsertCard} />}
    </PageLayout>
  );
}

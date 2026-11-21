import { DataTable } from "@/shared/components/DataTable";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
  type SortingState,
} from "@tanstack/react-table";
import { Pen, Plus, RotateCcw, Trash, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { CustomerDialog } from "./components/CustomerDialog";
import { useCustomerById } from "./hooks/useCustomerById";
import { useCustomers } from "./hooks/useCustomers";
import { customerToFormData } from "./utils/customerToFormData";
import { customerSchema, type CustomerFormData } from "./schema/customerSchema";
import type { CustomerResponse } from "./types/CustomerResponse";
import { useCreateCustomer } from "./hooks/useCreateCustomer";
import { useUpdateCustomer } from "./hooks/useUpdateCustomer";
import { useDeactivateCustomer } from "./hooks/useDeactivateCustomer";
import { useActivateCustomer } from "./hooks/useActivateCustomer";

interface CustomerColumns extends Pick<
  CustomerResponse,
  "nome_empresa" | "telefone" | "ativo" | "email" | "id"
> {}

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});

const helper = createColumnHelper<typeof features, CustomerColumns>();

export function CustomersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [upsertCard, setUpsertCard] = useState<boolean>(false);
  const [params, setParams] = useSearchParams();
  const { customers } = useCustomers();

  const { createCustomer } = useCreateCustomer();
  const { updateCustomer } = useUpdateCustomer();

  const { deactivateCustomer } = useDeactivateCustomer();
  const { activateCustomer } = useActivateCustomer();

  const updateMode = params.get("mode") === "update";

  const customerId = Number(params.get("id"));
  const { customer } = useCustomerById(
    customerId ? Number(customerId) : undefined,
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (customer) {
      reset(customerToFormData(customer));
    }
  }, [customer, reset]);

  const onSubmit = (data: CustomerFormData) => {
    if (updateMode && customerId) {
      updateCustomer({ id: customerId, data });
    } else {
      createCustomer(data);
    }
    console.log(data);
  };

  const columns = helper.columns([
    helper.accessor("nome_empresa", { header: "Nome" }),
    helper.accessor("email", { header: "E-mail" }),
    helper.accessor("telefone", { header: "Telefone" }),
    helper.accessor("ativo", {
      header: "Ativo",
      cell: (info) => (info.getValue() ? "Sim" : "Não"),
    }),
    helper.display({
      id: "actions",
      header: "Ações",
      cell: (info) => (
        <div className="flex justify-end items-center">
          <Button
            onClick={() => {
              setParams({
                mode: "update",
                id: info.row.original.id.toString(),
              });
              setUpsertCard(true);
            }}
            className="bg-white hover:bg-neutral-200 px-2.5"
          >
            <Pen color="black" />
          </Button>

          {info.row.original.ativo ? (
            <Button
              onClick={() => deactivateCustomer({ id: info.row.original.id })}
              className="bg-white hover:bg-neutral-200 px-2.5"
            >
              <Trash color="black" />
            </Button>
          ) : (
            <Button
              onClick={() => activateCustomer({ id: info.row.original.id })}
              className="bg-white hover:bg-neutral-200 px-2.5"
            >
              <RotateCcw color="black" />
            </Button>
          )}
        </div>
      ),
    }),
  ]);

  const table = useTable({
    features,
    columns,
    data: customers,
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

      {upsertCard && (
        <CustomerDialog
          open={upsertCard}
          setOpen={setUpsertCard}
          register={register}
          control={control}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
    </PageLayout>
  );
}

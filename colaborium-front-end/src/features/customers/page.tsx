import { DataTable } from "@/shared/components/DataTable";
import { PageLayout } from "@/shared/components/layout/PageLayout";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  rowPaginationFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
  type SortingState,
} from "@tanstack/react-table";
import { Pen, Plus, RotateCcw, Trash, User } from "lucide-react";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
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
import { Pagination } from "@/shared/components/Pagination";

interface CustomerColumns extends Pick<
  CustomerResponse,
  "nome_empresa" | "telefone" | "ativo" | "email" | "id"
> {}

export const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});

const helper = createColumnHelper<typeof features, CustomerColumns>();

const fieldTabMap: Partial<
  Record<keyof CustomerFormData, "empresa" | "representante">
> = {
  nome_empresa: "empresa",
  email: "empresa",
  cpf_cnpj_empresa: "empresa",
  telefone: "empresa",
  ie: "empresa",
  isento: "empresa",
  complemento_empresa: "empresa",
  cep_empresa: "empresa",
  endereco_empresa: "empresa",
  numero_empresa: "empresa",
  bairro_empresa: "empresa",
  cidade_empresa: "empresa",
  estado_empresa: "empresa",
  nome_representante: "representante",
  cpf_representante: "representante",
  nacionalidade_representante: "representante",
  estado_civil_representante: "representante",
  cargo_representante: "representante",
  complemento_representante: "representante",
  cep_representante: "representante",
  endereco_representante: "representante",
  numero_representante: "representante",
  bairro_representante: "representante",
  cidade_representante: "representante",
  estado_representante: "representante",
};

export function CustomersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [upsertCard, setUpsertCard] = useState<boolean>(false);
  const [tab, setTab] = useState<"empresa" | "representante">("empresa");
  const [params, setParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | "all">(10);
  const [incluirInativos, setIncluirInativos] = useState<boolean>(false);

  const { customers, pagination } = useCustomers({
    page,
    limit,
    incluirInativos,
  });
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
    setError,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (customer) {
      reset(customerToFormData(customer));
    }
  }, [customer, reset]);

  const duplicateFieldByMessage: Record<string, keyof CustomerFormData> = {
    "CNPJ já cadastrado": "cpf_cnpj_empresa",
    "E-mail já cadastrado": "email",
    "IE já cadastrada": "ie",
    "CPF do representante já cadastrado": "cpf_representante",
  };

  const onSubmit = async (data: CustomerFormData) => {
    const payload = {
      ...data,
      ie: data.isento ? null : data.ie,
      ativo: true,
    };

    try {
      if (updateMode && customerId) {
        await updateCustomer({ id: customerId, data: payload });
      } else {
        await createCustomer(payload, {
          onSuccess: () => {
            setUpsertCard(false);
          },
        });
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        const message = error.response.data.message as string;
        const field = duplicateFieldByMessage[message];

        if (field) {
          setError(field, { message });
          const errorTab = fieldTabMap[field];
          if (errorTab) setTab(errorTab);
          return;
        }
      }

      throw error;
    }
  };

  const onInvalid = (invalidErrors: FieldErrors<CustomerFormData>) => {
    const errorField = Object.keys(invalidErrors)[0] as keyof CustomerFormData;
    const errorTab = fieldTabMap[errorField];
    if (errorTab) setTab(errorTab);
  };

  function handleRowClick(customerId: number) {
    setParams({ id: `${customerId}` });
    if (customer) {
      reset(customerToFormData(customer));
    }
    setUpsertCard(true);
  }

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
            onClick={(e) => {
              e.stopPropagation();
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
              onClick={(e) => {
                e.stopPropagation();
                deactivateCustomer({ id: info.row.original.id });
              }}
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
      fullHeight
    >
      <div className="flex flex-col gap-5 min-h-0 flex-1">
        <div className="flex flex-row gap-5 shrink-0 w-full items-end justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="incluir-inativos"
              checked={incluirInativos}
              onCheckedChange={(checked) => {
                setIncluirInativos(checked === true);
                setPage(1);
              }}
            />
            <Label htmlFor="incluir-inativos">Mostrar inativos</Label>
          </div>
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

        <div className="min-h-0 flex-1 overflow-y-auto">
          <DataTable onRowClick={handleRowClick} table={table} />
        </div>

        <Pagination
          page={pagination?.actual_page ?? 1}
          totalPages={pagination?.total_pages ?? 1}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={(v) => {
            setLimit(v);
            setPage(1);
          }}
        />
      </div>

      {upsertCard && (
        <CustomerDialog
          reset={reset}
          open={upsertCard}
          setOpen={setUpsertCard}
          register={register}
          control={control}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onInvalid={onInvalid}
          tab={tab}
          setTab={setTab}
        />
      )}
    </PageLayout>
  );
}

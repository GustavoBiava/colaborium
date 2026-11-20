import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CustomerResponse } from "../types/CustomerResponse";

async function fetchCustomerById(id: number): Promise<CustomerResponse> {
  const { data } = await api.get<CustomerResponse>(`/clientes/${id}`);
  return data;
}

export function useCustomerById(id: number) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customers", id],
    queryFn: () => fetchCustomerById(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  return { customer: data, isLoading, isError, error };
}

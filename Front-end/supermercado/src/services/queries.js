import { useQuery } from "@tanstack/react-query";
import productServices from "./productServices";
import userServices from "./userServices";
import categoryServices from "./categoryServices";
import customerServices from "./customerServices";
import orderServices from "./orderServices";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: productServices.list,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productServices.get(id),
    enabled: !!id,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: userServices.list,
    retry: 0,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryServices.list,
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: customerServices.list,
  });
}

export function useCustomer(id) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerServices.get(id),
    enabled: !!id,
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderServices.list,
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderServices.get(id),
    enabled: !!id,
  });
}

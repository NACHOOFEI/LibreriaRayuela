import React from "react";
import axiosServices from "../services/axiosServices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
  Name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  DNI: z.string().min(6, "El DNI debe tener al menos 6 caracteres"),
  Email: z.string().email("Email inválido"),
  Phone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
  Adress: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
});

export default function CreateCustomer() {
  const [, navigate] = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Obtener usuario logueado del localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("Usuario no logueado");

      const customerData = {
        ...data,
        UserId: user.id, 
      };

      const response = await axiosServices.post("/Customer", customerData);
      return response.data;
    },
    onSuccess: () => {
      alert("Cliente creado correctamente");
      navigate("/checkout");
    },
    onError: (error) => {
      console.error(error);
      alert("Error al crear el cliente");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Nombre" {...register("Name")} />
      {errors.Name && <p>{errors.Name.message}</p>}

      <input placeholder="DNI" {...register("DNI")} />
      {errors.DNI && <p>{errors.DNI.message}</p>}

      <input placeholder="Email" {...register("Email")} />
      {errors.Email && <p>{errors.Email.message}</p>}

      <input placeholder="Teléfono" {...register("Phone")} />
      {errors.Phone && <p>{errors.Phone.message}</p>}

      <input placeholder="Dirección" {...register("Adress")} />
      {errors.Adress && <p>{errors.Adress.message}</p>}

      <button type="submit">Crear cliente</button>
    </form>
  );
}

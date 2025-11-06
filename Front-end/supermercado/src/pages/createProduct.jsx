import axiosServices from "../services/axiosServices";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripcion debe tener al menos 10 caracteres"),
  price: z.preprocess(
    (v) => Number(v),
    z.number().min(1, "El precio debe ser mayor a 0")
  ),
  stock: z.preprocess(
    (v) => Number(v),
    z.number().min(0, "El stock no puede ser negativo")
  ),
  // En react-hook-form los inputs tipo file vienen como FileList
  image: z
    .any()
    .refine((fileList) => fileList && fileList.length === 1, {
      message: "Debe subir una imagen",
    })
    .refine(
      (fileList) => {
        const file = fileList[0];
        return file && file.size <= MAX_FILE_SIZE;
      },
      {
        message: `El tamaño máximo es ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      }
    )
    .refine(
      (fileList) => {
        const file = fileList[0];
        return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
      {
        message: `Solo se aceptan los formatos: ${ACCEPTED_IMAGE_TYPES.map(
          (t) => t.split("/")[1]
        ).join(", ")}`,
      }
    ),
});

export default function CreateProduct() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: async ({ url, formData }) => {
      // Enviar multipart/form-data
      return axiosServices.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      alert("Producto creado con éxito!");
      reset();
      navigate("/admin");
    },
    onError: (error) => {
      console.error(error);
      alert(
        "Error al crear producto: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    const file = data.image[0];
    formData.append("image", file);
    mutation.mutate({ url: "/api/products", formData });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="">Nombre</label>
          <input type="text" {...register("name")} />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="">Descripcion</label>
          <input type="text" {...register("description")} />
          {errors.description && (
            <p className="text-red-600">{errors.description.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="">Precio</label>
          <input type="number" {...register("price")} />
          {errors.price && (
            <p className="text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="">Stock</label>
          <input type="number" {...register("stock")} />
          {errors.stock && (
            <p className="text-red-600">{errors.stock.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="">Imagen</label>
          <input type="file" {...register("image")} />
          {errors.image && (
            <p className="text-red-600">{errors.image.message}</p>
          )}
        </div>
        <button type="submit">Crear Producto</button>
      </form>
    </>
  );
}

import axiosServices from "../services/axiosServices";
import z from "zod";
import useform from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {useMutation} from "react-query";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
];

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripcion debe tener al menos 10 caracteres"),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  image: z.instanceof(File, { message: "Debe subir una imagen" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE, 
      `El tamaño máximo es ${MAX_FILE_SIZE / (1024 * 1024)}MB` // Validación de Tamaño
    )
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Solo se aceptan los formatos: ${ACCEPTED_IMAGE_TYPES.map(t => t.split('/')[1]).join(', ')}` // Validación de Tipo MIME
    )
});

export default function CreateProduct(){
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationKey: ['createProduct'],
        mutationFn: axiosServices.post,
            onSuccess: () => {
        alert("Producto creado con éxito!");
        reset();
    },
        onError: (error) => {
            console.error(error);
            alert("Error al crear producto");
    },
    })

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('stock', data.stock.toString());
        formData.append('image', data.image);
        mutation.mutate(['products', formData])
    }
    const { register, handleSubmit, formState: { errors } } = useform({
        resolver: zodResolver(productSchema)
    });

    return(
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label htmlFor="">Nombre</label>
        <input type="text" {...register("name")} />
        </div>
        <div>
            <label htmlFor="">Descripcion</label>
            <input type="text" {...register("description")} />
        </div>
        <div>
            <label htmlFor="">Precio</label>
            <input type="number" {...register("price")} />
        </div>
        <div>
            <label htmlFor="">Stock</label>
            <input type="number" {...register("stock")} />
        </div>
        <div>
            <label htmlFor="">Imagen</label>
            <input type="file" {...register("image")} />
        </div>
        <button type="submit">Crear Producto</button>
    </form>
    </>)

}
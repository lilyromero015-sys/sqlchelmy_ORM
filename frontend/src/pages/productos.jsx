
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const FORMULARIO_VACIO = {
    nombre: "",
    descripcion: "",
    precio: "",
    stock_min: "",
    categoria_id: "",
};

function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
    const [editandoId, setEditandoId] = useState(null);

    const cargarProductos = () => {
        fetch(`${API_URL}/products`)
            .then((respuesta) => respuesta.json())
            .then((datos) => setProductos(datos))
            .catch(() => setError("No se pudo conectar con la API"));
    };

    useEffect(() => {
        cargarProductos();

        fetch(`${API_URL}/categorias`)
            .then((respuesta) => respuesta.json())
            .then((datos) => setCategorias(datos))
            .catch(() => setError("No se pudo conectar con la API"));
    }, []);

    const manejarCambio = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setFormulario(FORMULARIO_VACIO);
    };

    const guardarProducto = async (e) => {
        e.preventDefault();
        setError("");

        const datosProducto = {
            nombre: formulario.nombre,
            descripcion: formulario.descripcion,
            precio: Number(formulario.precio),
            stock_min: Number(formulario.stock_min),
            categoria_id: Number(formulario.categoria_id),
        };

        const editando = editandoId !== null;
        const url = editando
            ? `${API_URL}/products/${editandoId}`
            : `${API_URL}/products`;

        try {
            const respuesta = await fetch(url, {
                method: editando ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosProducto),
            });

            if (!respuesta.ok) {
                setError(`No se pudo guardar el producto (código ${respuesta.status})`);
                return;
            }

            cancelarEdicion();
            cargarProductos();
        } catch {
            setError("No se pudo conectar con la API");
        }
    };

    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

        setError("");

        try {
            const respuesta = await fetch(`${API_URL}/products/${id}`, {
                method: "DELETE",
            });

            if (!respuesta.ok) {
                setError(`No se pudo eliminar el producto (código ${respuesta.status})`);
                return;
            }

            cargarProductos();
        } catch {
            setError("No se pudo conectar con la API");
        }
    };

    const iniciarEdicion = (p) => {
        setEditandoId(p.id);
        setFormulario({
            nombre: p.nombre,
            descripcion: p.descripcion ?? "",
            precio: p.precio ?? "",
            stock_min: p.stock_min ?? "",
            categoria_id: p.categoria_id,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const claseInput =
        "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Productos</h1>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
                )}

                <form
                    onSubmit={guardarProducto}
                    className="mb-6 grid gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2"
                >
                    <h2 className="text-xl font-semibold text-gray-800 md:col-span-2">
                        {editandoId !== null ? "Editar producto" : "Nuevo producto"}
                    </h2>

                    <input
                        className={claseInput}
                        name="nombre"
                        placeholder="Nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        required
                    />

                    <input
                        className={claseInput}
                        name="descripcion"
                        placeholder="Descripción"
                        value={formulario.descripcion}
                        onChange={manejarCambio}
                    />

                    <input
                        className={claseInput}
                        name="precio"
                        type="number"
                        min="1"
                        placeholder="Precio"
                        value={formulario.precio}
                        onChange={manejarCambio}
                        required
                    />

                    <input
                        className={claseInput}
                        name="stock_min"
                        type="number"
                        min="0"
                        placeholder="Stock mínimo"
                        value={formulario.stock_min}
                        onChange={manejarCambio}
                        required
                    />

                    <select
                        className={claseInput}
                        name="categoria_id"
                        value={formulario.categoria_id}
                        onChange={manejarCambio}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                        >
                            {editandoId !== null ? "Actualizar producto" : "Guardar producto"}
                        </button>

                        {editandoId !== null && (
                            <button
                                type="button"
                                onClick={cancelarEdicion}
                                className="rounded bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Descripción</th>
                                <th className="px-4 py-3">Precio</th>
                                <th className="px-4 py-3">Stock mín.</th>
                                <th className="px-4 py-3">Categoría</th>
                                <th className="px-4 py-3">Disponible</th>
                                <th className="px-4 py-3">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {productos.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{p.id}</td>
                                    <td className="px-4 py-3 font-medium">{p.nombre}</td>
                                    <td className="px-4 py-3 text-gray-600">{p.descripcion}</td>
                                    <td className="px-4 py-3">
                                        ${p.precio?.toLocaleString("es-CO")}
                                    </td>
                                    <td className="px-4 py-3">{p.stock_min}</td>
                                    <td className="px-4 py-3">{p.categoria_nombre}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-semibold ${p.disponible
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {p.disponible ? "Sí" : "No"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => iniciarEdicion(p)}
                                                className="rounded bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => eliminarProducto(p.id)}
                                                className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Productos;

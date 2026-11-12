
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const FORMULARIO_CATEGORIA = {
    nombre: "",
    descripcion: "",
};

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");
    const [nuevaCategoria, setNuevaCategoria] = useState(FORMULARIO_CATEGORIA);

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = () => {
        fetch(`${API_URL}/categorias`)
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error("Error al consultar categorías");
                }
                return respuesta.json();
            })
            .then((datos) => setCategorias(datos))
            .catch(() => setError("No se pudieron cargar las categorías"));
    };

    const guardarCategoria = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const respuesta = await fetch(`${API_URL}/categorias`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevaCategoria),
            });

            if (!respuesta.ok) {
                setError(`No se pudo registrar la categoría (código ${respuesta.status})`);
                return;
            }

            const categoriaCreada = await respuesta.json();

            setCategorias((categoriasAnteriores) => [
                ...categoriasAnteriores,
                categoriaCreada,
            ]);

            setNuevaCategoria(FORMULARIO_CATEGORIA);
        } catch {
            setError("No se pudo conectar con la API");
        }
    };

    const claseInput =
        "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">
                    Categorías
                </h1>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={guardarCategoria}
                    className="mb-6 grid gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2"
                >
                    <h2 className="text-lg font-semibold text-gray-800 md:col-span-2">
                        Nueva categoría
                    </h2>

                    <input
                        className={claseInput}
                        name="nombre"
                        placeholder="Nombre de la categoría"
                        value={nuevaCategoria.nombre}
                        onChange={(e) =>
                            setNuevaCategoria({
                                ...nuevaCategoria,
                                nombre: e.target.value,
                            })
                        }
                        required
                    />

                    <input
                        className={claseInput}
                        name="descripcion"
                        placeholder="Descripción de la categoría"
                        value={nuevaCategoria.descripcion}
                        onChange={(e) =>
                            setNuevaCategoria({
                                ...nuevaCategoria,
                                descripcion: e.target.value,
                            })
                        }
                        required
                    />

                    <div>
                        <button
                            type="submit"
                            className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                        >
                            Guardar categoría
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Descripción</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {categorias.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{c.id}</td>
                                    <td className="px-4 py-3 font-medium">{c.nombre}</td>
                                    <td className="px-4 py-3 text-gray-600">{c.descripcion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Categorias;

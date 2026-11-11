
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000";

function Entradas() {
    const [entradas, setEntradas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");

    const [nuevaEntrada, setNuevaEntrada] = useState({
        entra_producto_id: "",
        entra_cantidad: "",
        entra_factura: "",
        entra_stand: "",
        entra_ubicacion: "",
    });

    const cargarEntradas = () => {
        fetch(`${API_URL}/entradas`)
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error("Error al consultar entradas");
                }
                return respuesta.json();
            })
            .then((datos) => setEntradas(datos))
            .catch(() => setError("No se pudieron cargar las entradas"));
    };

    useEffect(() => {
        cargarEntradas();

        fetch(`${API_URL}/products`)
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error("Error al consultar productos");
                }
                return respuesta.json();
            })
            .then((datos) => setProductos(datos))
            .catch(() => setError("No se pudieron cargar los productos"));
    }, []);

    const guardarEntrada = async (e) => {
        e.preventDefault();
        setError("");

        const datosEntrada = {
            entra_producto_id: Number(nuevaEntrada.entra_producto_id),
            entra_cantidad: Number(nuevaEntrada.entra_cantidad),
            entra_factura: nuevaEntrada.entra_factura,
            entra_stand: nuevaEntrada.entra_stand,
            entra_ubicacion: nuevaEntrada.entra_ubicacion,
        };

        try {
            const respuesta = await fetch(`${API_URL}/entradas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosEntrada),
            });

            if (!respuesta.ok) {
                setError(`No se pudo registrar la entrada (código ${respuesta.status})`);
                return;
            }

            await respuesta.json();

            setNuevaEntrada({
                entra_producto_id: "",
                entra_cantidad: "",
                entra_factura: "",
                entra_stand: "",
                entra_ubicacion: "",
            });

            cargarEntradas();
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
                    Entradas de productos
                </h1>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={guardarEntrada}
                    className="mb-6 grid gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2"
                >
                    <h2 className="text-lg font-semibold text-gray-800 md:col-span-2">
                        Registrar nueva entrada
                    </h2>

                    <select
                        className={claseInput}
                        value={nuevaEntrada.entra_producto_id}
                        onChange={(e) =>
                            setNuevaEntrada({
                                ...nuevaEntrada,
                                entra_producto_id: e.target.value,
                            })
                        }
                        required
                    >
                        <option value="">Selecciona un producto</option>

                        {productos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>

                    <input
                        className={claseInput}
                        type="number"
                        min="1"
                        placeholder="Cantidad"
                        value={nuevaEntrada.entra_cantidad}
                        onChange={(e) =>
                            setNuevaEntrada({
                                ...nuevaEntrada,
                                entra_cantidad: e.target.value,
                            })
                        }
                        required
                    />

                    <input
                        className={claseInput}
                        placeholder="Número de factura"
                        value={nuevaEntrada.entra_factura}
                        onChange={(e) =>
                            setNuevaEntrada({
                                ...nuevaEntrada,
                                entra_factura: e.target.value,
                            })
                        }
                        required
                    />

                    <input
                        className={claseInput}
                        placeholder="Stand"
                        value={nuevaEntrada.entra_stand}
                        onChange={(e) =>
                            setNuevaEntrada({
                                ...nuevaEntrada,
                                entra_stand: e.target.value,
                            })
                        }
                        required
                    />

                    <input
                        className={claseInput}
                        placeholder="Ubicación"
                        value={nuevaEntrada.entra_ubicacion}
                        onChange={(e) =>
                            setNuevaEntrada({
                                ...nuevaEntrada,
                                entra_ubicacion: e.target.value,
                            })
                        }
                        required
                    />

                    <div>
                        <button
                            type="submit"
                            className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                        >
                            Registrar entrada
                        </button>
                    </div>
                </form>

                <div className="overflow-x-auto rounded-lg bg-white shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Producto</th>
                                <th className="px-4 py-3">Cantidad</th>
                                <th className="px-4 py-3">Factura</th>
                                <th className="px-4 py-3">Stand</th>
                                <th className="px-4 py-3">Ubicación</th>
                                <th className="px-4 py-3">Fecha</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {entradas.map((entrada) => (
                                <tr key={entrada.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{entrada.id}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {entrada.producto_nombre}
                                    </td>
                                    <td className="px-4 py-3">{entrada.cantidad}</td>
                                    <td className="px-4 py-3">{entrada.factura}</td>
                                    <td className="px-4 py-3">{entrada.stand}</td>
                                    <td className="px-4 py-3">{entrada.ubicacion}</td>
                                    <td className="px-4 py-3">{entrada.fecha}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Entradas;

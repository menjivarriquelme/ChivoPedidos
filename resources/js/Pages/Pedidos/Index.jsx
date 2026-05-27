import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

// Configuración de colores y etiquetas por estado
const estadoConfig = {
    pendiente:   { label: 'Pendiente',   class: 'bg-yellow-100 text-yellow-700' },
    en_proceso:  { label: 'En proceso',  class: 'bg-blue-100 text-blue-700'     },
    entregado:   { label: 'Entregado',   class: 'bg-green-100 text-green-700'   },
    cancelado:   { label: 'Cancelado',   class: 'bg-red-100 text-red-700'       },
};

export default function Index({ pedidos }) {

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este pedido?')) {
            router.delete(route('pedidos.destroy', id));
        }
    };

    const handleEstado = (id, estadoActual) => {
        const estados = ['pendiente', 'en_proceso', 'entregado', 'cancelado'];
        const opciones = estados.filter(e => e !== estadoActual);

        const mensaje = `Cambiar estado a:\n${opciones.map((e, i) => `${i + 1}. ${estadoConfig[e].label}`).join('\n')}\n\nEscribe el número:`;
        const eleccion = prompt(mensaje);

        if (!eleccion) return;
        const nuevo = opciones[parseInt(eleccion) - 1];
        if (!nuevo) return;

        router.put(route('pedidos.update', id), { estado: nuevo });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pedidos" />

            <div className="p-6 md:p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
                        <p className="text-sm text-gray-500 mt-1">Gestión y seguimiento de pedidos</p>
                    </div>
                    <Link
                        href={route('pedidos.create')}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Pedido
                    </Link>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="px-6 py-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-600">
                            Total: <span className="text-gray-900 font-semibold">{pedidos.length}</span> pedidos
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pedidos.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <p className="text-sm font-medium">No hay pedidos registrados</p>
                                                <Link href={route('pedidos.create')} className="text-xs text-indigo-600 hover:underline">
                                                    Crear el primero
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    pedidos.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{p.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{p.cliente}</td>
                                            <td className="px-6 py-4 text-gray-700 font-semibold">${Number(p.total).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoConfig[p.estado]?.class}`}>
                                                    {estadoConfig[p.estado]?.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{p.created_at}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">

                                                    {/* Ver detalle */}
                                                    <Link
                                                        href={route('pedidos.show', p.id)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors duration-150"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Ver
                                                    </Link>

                                                    {/* Cambiar estado */}
                                                    <button
                                                        onClick={() => handleEstado(p.id, p.estado)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors duration-150"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        Estado
                                                    </button>

                                                    {/* Eliminar solo si está pendiente o cancelado */}
                                                    {(p.estado === 'pendiente' || p.estado === 'cancelado') && (
                                                        <button
                                                            onClick={() => handleDelete(p.id)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors duration-150"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

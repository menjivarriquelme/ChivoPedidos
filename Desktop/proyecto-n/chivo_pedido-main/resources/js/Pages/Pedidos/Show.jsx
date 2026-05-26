import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const estadoConfig = {
    pendiente:   { label: 'Pendiente',   class: 'bg-yellow-100 text-yellow-700' },
    en_proceso:  { label: 'En proceso',  class: 'bg-blue-100 text-blue-700'     },
    entregado:   { label: 'Entregado',   class: 'bg-green-100 text-green-700'   },
    cancelado:   { label: 'Cancelado',   class: 'bg-red-100 text-red-700'       },
};

const estadoSiguiente = {
    pendiente:  'en_proceso',
    en_proceso: 'entregado',
};

export default function Show({ pedido }) {

    const handleAvanzarEstado = () => {
        const siguiente = estadoSiguiente[pedido.estado];
        if (!siguiente) return;
        if (confirm(`¿Cambiar estado a "${estadoConfig[siguiente].label}"?`)) {
            router.put(route('pedidos.update', pedido.id), { estado: siguiente });
        }
    };

    const handleCancelar = () => {
        if (confirm('¿Estás seguro de cancelar este pedido?')) {
            router.put(route('pedidos.update', pedido.id), { estado: 'cancelado' });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Pedido #${pedido.id}`} />

            <div className="p-6 md:p-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Link
                        href={route('pedidos.index')}
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-800">Pedido #{pedido.id}</h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoConfig[pedido.estado]?.class}`}>
                                {estadoConfig[pedido.estado]?.label}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">Registrado el {pedido.created_at}</p>
                    </div>

                    {/* Botones de acción según estado */}
                    <div className="flex items-center gap-2">
                        {estadoSiguiente[pedido.estado] && (
                            <button
                                onClick={handleAvanzarEstado}
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                                Avanzar a {estadoConfig[estadoSiguiente[pedido.estado]]?.label}
                            </button>
                        )}
                        {(pedido.estado === 'pendiente' || pedido.estado === 'en_proceso') && (
                            <button
                                onClick={handleCancelar}
                                className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-150"
                            >
                                Cancelar pedido
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Columna izquierda — Info del pedido */}
                    <div className="space-y-6">

                        {/* Card cliente */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Cliente</h2>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-gray-800">{pedido.cliente}</p>
                            </div>
                        </div>

                        {/* Card notas */}
                        {pedido.notas && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Notas</h2>
                                <p className="text-sm text-gray-600 leading-relaxed">{pedido.notas}</p>
                            </div>
                        )}

                        {/* Card total */}
                        <div className="bg-indigo-600 rounded-2xl p-5 text-white">
                            <p className="text-sm font-medium text-indigo-200 mb-1">Total del pedido</p>
                            <p className="text-3xl font-bold">${Number(pedido.total).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Columna derecha — Productos */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-semibold text-gray-700">
                                    Productos <span className="text-gray-400 font-normal text-sm">({pedido.detalles.length})</span>
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-3">Producto</th>
                                            <th className="px-6 py-3 text-center">Cantidad</th>
                                            <th className="px-6 py-3 text-right">Precio unit.</th>
                                            <th className="px-6 py-3 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pedido.detalles.map((d) => (
                                            <tr key={d.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-800">{d.producto}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                                                        {d.cantidad}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-600">${Number(d.precio_unitario).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right font-semibold text-gray-800">${Number(d.subtotal).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-gray-200">
                                            <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total</td>
                                            <td className="px-6 py-4 text-right text-base font-bold text-indigo-600">${Number(pedido.total).toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

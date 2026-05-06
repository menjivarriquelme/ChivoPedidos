import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ producto, categorias }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        stock: producto.stock || 0,
        categoria_id: producto.categoria_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('productos.update', producto.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Producto" />

            <div className="p-6 md:p-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Link
                        href={route('productos.index')}
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Editar Producto</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Actualizando: <span className="font-medium text-gray-700">{producto.nombre}</span>
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del producto</label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={e => setData('nombre', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
                            />
                            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <textarea
                                value={data.descripcion}
                                onChange={e => setData('descripcion', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 resize-none"
                            />
                        </div>

                        {/* Precio y Stock */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio ($)</label>
                                <input
                                    type="number"
                                    value={data.precio}
                                    onChange={e => setData('precio', e.target.value)}
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
                                />
                                {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                                <input
                                    type="number"
                                    value={data.stock}
                                    onChange={e => setData('stock', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
                                />
                                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
                            <select
                                value={data.categoria_id}
                                onChange={e => setData('categoria_id', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 bg-white"
                            >
                                <option value="" disabled>Seleccionar categoría</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                            {errors.categoria_id && <p className="text-xs text-red-500 mt-1">{errors.categoria_id}</p>}
                        </div>

                        {/* Botones */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors duration-200 shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {processing ? 'Actualizando...' : 'Actualizar producto'}
                            </button>
                            <Link
                                href={route('productos.index')}
                                className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-150"
                            >
                                Cancelar
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

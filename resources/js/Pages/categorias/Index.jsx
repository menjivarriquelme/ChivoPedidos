import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ categorias }) {

    const [modalAbierto, setModalAbierto] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const { data, setData, put, processing } = useForm({
        nombre: '',
        estado: 'activo',
    });

    const abrirModal = (categoria) => {
        setCategoriaSeleccionada(categoria);
        setData({
            nombre: categoria.nombre,
            estado: categoria.estado ? 'activo' : 'inactivo',
        });
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setCategoriaSeleccionada(null);
    };

    const handleGuardar = (e) => {
        e.preventDefault();
        put(route('categorias.update', categoriaSeleccionada.id), {
            onSuccess: () => cerrarModal(),
        });
    };

    const handleEliminar = (id) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            router.delete(route('categorias.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Categorías" />

            <div className="p-6 md:p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
                        <p className="text-sm text-gray-500 mt-1">Gestión de categorías de productos</p>
                    </div>
                    <Link
                        href={route('categorias.create')}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Categoría
                    </Link>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="px-6 py-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-600">
                            Total: <span className="text-gray-900 font-semibold">{categorias.length}</span> categorías
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3 text-center">Estado</th>
                                    <th className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categorias.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h18M3 17h18" />
                                                </svg>
                                                <p className="text-sm font-medium">No hay categorías registradas</p>
                                                <Link href={route('categorias.create')} className="text-xs text-indigo-600 hover:underline">
                                                    Crear la primera
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    categorias.map((categoria) => (
                                        <tr key={categoria.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{categoria.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{categoria.nombre}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    categoria.estado
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {categoria.estado ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">

                                                    {/* Editar */}
                                                    <button
                                                        onClick={() => abrirModal(categoria)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors duration-150"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </button>

                                                    {/* Eliminar */}
                                                    <button
                                                        onClick={() => handleEliminar(categoria.id)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors duration-150"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Eliminar
                                                    </button>
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

            {/* Modal Editar */}
            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    {/* Fondo oscuro */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={cerrarModal}
                    />

                    {/* Contenido del modal */}
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">

                        {/* Header modal */}
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-800">Editar Categoría</h2>
                            <button
                                onClick={cerrarModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleGuardar} className="space-y-4">

                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            {/* Estado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
                                <select
                                    value={data.estado}
                                    onChange={e => setData('estado', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
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
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-150"
                                >
                                    Cancelar
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}

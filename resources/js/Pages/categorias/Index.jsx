import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categorias}) {
    const cambiarEstado = (id) => {
        router.patch(route('categorias.cambiarEstado', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Categorias" />

            <div className="p-6">
                <div className="bg-white shadow-md rounded-lg p-6">

                    {/*Header*/}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Gestion de Categorias
                        </h1>

                        <Link 
                            href={route('categorias.create')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            + Nueva Categoria
                        </Link>
                    </div>


                    {/*Tabla*/}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">

                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        ID 
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Nombre
                                    </th>
                                    
                                    <th className="px-4 py-3 text-center">
                                        Estado
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {categorias.length > 0 ? (
                                    categorias.map((categoria) => (
                                        <tr
                                            key={categoria.id}
                                            className="border-t"
                                        >
                                            <td className="px-4 py-3">
                                                {categoria.id}
                                            </td>

                                            <td className="px-4 py-3">
                                                {categoria.nombre}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <span 
                                                    className={`px-3 py-1 rounded-full text-sm text-white ${
                                                        categoria.estado
                                                            ? 'bg-green-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                >
                                                    {categoria.estado
                                                        ?'Activo'
                                                        :'Inactivo'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2">

                                                    {/*Editar*/}
                                                    <Link 
                                                        href={route(
                                                            'categorias.edit',
                                                            categoria.id
                                                        )}
                                                        className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
                                                    >
                                                        Editar
                                                    </Link>

                                                    {/*Activar/Desactivar*/}
                                                    <button 
                                                        onClick={() => 
                                                            cambiarEstado(
                                                                categoria.id
                                                            )
                                                        }
                                                        className={`px-3 py-2 rounded text-white ${
                                                            categoria.estado
                                                            ?'bg-red-500 hover:bg-red-600'
                                                            :'bg-green-500 hover:bg-green-600'
                                                        }`}
                                                    >
                                                        {categoria.estado
                                                            ?'Desactivar'
                                                            :'Activar'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td 
                                            colSpan="4"
                                            className="text-center py-6 text-gray-500"
                                        >
                                            No hay categorias registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>                
    );
}
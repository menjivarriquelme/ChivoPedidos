import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm} from '@inertiajs/react';

export default function Edit({categoria}) {
    const {data, setData, put, processing, errors} = useForm({
        nombre: categoria.nombre || '',
        estado: categoria.estado ? 'activo' : 'inactivo',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('categorias.update', categoria.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Categoria" />

            <div className="p-6">
                <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Editar Categoria
                        </h1>

                        <Link
                            href={route('categorias.index')}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Volver
                        </Link>
                    </div>

                    <form onSubmit={submit}>
                        {/*Nombre*/}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>

                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => 
                                    setData('nombre', e.target.value)
                                }
                                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-200"
                                placeholder="Ingrese el nombre de la categoria"
                            />

                            {errors.nombre && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        {/*Estado*/}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700">
                                Estado
                            </label>

                            <select
                                value={data.estado}
                                onChange={(e) =>
                                    setData('estado', e.target.value)
                                }
                                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-200"
                            >
                                <option value="activo">
                                    Activo
                                </option>

                                <option value="inactivo">
                                    Inactivo
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-yellow-600 text-white px-5 py-2 rounded-lg hover:bg-yellow-700 disabled:opcaity-50"
                        >
                            {processing 
                                ?'Actualizando...'
                                :'Actualizar Categoria'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
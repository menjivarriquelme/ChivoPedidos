import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        estado: 'activo',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('categorias.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Crear Categoria" />

            <div className="p-6">
                <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6"> 
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Crear Categoria
                        </h1>

                        <Link
                            href={route('categorias.index')}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            volver
                        </Link>
                    </div>

                    <form onSubmit={submit}> 
                        {/*Nombre*/}
                        <div className="mb-4">
                            <label className="block text-gray-sm font-medium text-gray-700">
                                Nombre
                            </label>

                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) =>
                                    setData('nombre', e.target.value)
                                }
                                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                                placeholder="Ingrese el nombre de la categoria"
                            />

                            {errors.nombre && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        {/*Estado*/}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Estado
                            </label>

                            <select
                                value={data.estado}
                                onChange={(e) =>
                                    setData('estado', e.target.value)
                                }
                                className="w-full mt-1 border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                            > 
                                <option value={1}>Activo</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        > 
                            {processing
                                ?'Guardando...'
                                :'Guardar Categoria'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
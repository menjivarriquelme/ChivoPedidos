import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, UserCheck, UserX } from 'lucide-react';

export default function Index({ auth, clientes }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Clientes" />

            <div className="py-8 px-4 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
                    <Link
                        href={route('clientes.create')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={18} /> Nuevo cliente
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Nombre</th>
                                <th className="px-4 py-3 text-left">Teléfono</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">DUI</th>
                                <th className="px-4 py-3 text-left">Estado</th>
                                <th className="px-4 py-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {clientes.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                        No hay clientes registrados.
                                    </td>
                                </tr>
                            )}
                            {clientes.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">{cliente.nombre}</td>
                                    <td className="px-4 py-3 text-gray-600">{cliente.telefono ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-600">{cliente.email ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-600">{cliente.dui ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        {cliente.activo ? (
                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                <UserCheck size={15} /> Activo
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-400 font-medium">
                                                <UserX size={15} /> Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={route('clientes.edit', cliente.id)}
                                            className="flex items-center gap-1 text-blue-600 hover:underline"
                                        >
                                            <Pencil size={14} /> Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
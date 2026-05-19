import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, UserCheck, UserX, Eye } from 'lucide-react';

export default function Index({ auth, usuarios }) {
    function toggleActivo(usuario) {
        if (confirm(`¿Deseas ${usuario.activo ? 'inactivar' : 'activar'} a ${usuario.name}?`)) {
            router.patch(route('usuarios.toggle', usuario.id));
        }
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Usuarios" />

            <div className="py-8 px-4 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
                    <Link
                        href={route('usuarios.create')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={18} /> Nuevo usuario
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Nombre</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Teléfono</th>
                                <th className="px-4 py-3 text-left">Rol</th>
                                <th className="px-4 py-3 text-left">Estado</th>
                                <th className="px-4 py-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {usuarios.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">{usuario.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{usuario.email}</td>
                                    <td className="px-4 py-3 text-gray-600">{usuario.telefono ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {usuario.roles[0]?.name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {usuario.activo ? (
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
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={route('usuarios.show', usuario.id)}
                                                className="flex items-center gap-1 text-gray-600 hover:underline"
                                            >
                                                <Eye size={14} /> Ver
                                            </Link>
                                            <Link
                                                href={route('usuarios.edit', usuario.id)}
                                                className="flex items-center gap-1 text-blue-600 hover:underline"
                                            >
                                                <Pencil size={14} /> Editar
                                            </Link>
                                            <button
                                                onClick={() => toggleActivo(usuario)}
                                                className={`flex items-center gap-1 hover:underline ${usuario.activo ? 'text-red-500' : 'text-green-600'}`}
                                            >
                                                {usuario.activo ? <><UserX size={14} /> Inactivar</> : <><UserCheck size={14} /> Activar</>}
                                            </button>
                                        </div>
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
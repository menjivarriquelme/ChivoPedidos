import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, ArrowLeft, UserCheck, UserX } from 'lucide-react';

function Campo({ label, value }) {
    return (
        <div className="py-3 border-b border-gray-100 last:border-0">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
            <p className="text-sm text-gray-800">{value ?? '—'}</p>
        </div>
    );
}

export default function Show({ auth, usuario }) {
    function toggleActivo() {
        if (confirm(`¿Deseas ${usuario.activo ? 'inactivar' : 'activar'} a ${usuario.name}?`)) {
            router.patch(route('usuarios.toggle', usuario.id));
        }
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Usuario: ${usuario.name}`} />

            <div className="py-8 px-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('usuarios.index')}
                            className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">{usuario.name}</h1>
                    </div>
                    <Link
                        href={route('usuarios.edit', usuario.id)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Pencil size={16} /> Editar
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        {usuario.activo ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                                <UserCheck size={16} /> Activo
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-400 font-medium text-sm">
                                <UserX size={16} /> Inactivo
                            </span>
                        )}
                        <button
                            onClick={toggleActivo}
                            className={`text-sm px-3 py-1 rounded-lg border ${usuario.activo ? 'text-red-500 border-red-300 hover:bg-red-50' : 'text-green-600 border-green-300 hover:bg-green-50'}`}
                        >
                            {usuario.activo ? 'Inactivar usuario' : 'Activar usuario'}
                        </button>
                    </div>

                    <Campo label="Nombre completo" value={usuario.name} />
                    <Campo label="Email" value={usuario.email} />
                    <Campo label="Teléfono" value={usuario.telefono} />
                    <Campo label="Rol" value={usuario.roles[0]?.name} />
                    <Campo label="Registrado el" value={new Date(usuario.created_at).toLocaleDateString('es-SV')} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
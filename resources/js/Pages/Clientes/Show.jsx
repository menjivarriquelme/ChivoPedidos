import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pencil, ArrowLeft, UserCheck, UserX } from 'lucide-react';

function Campo({ label, value }) {
    return (
        <div className="py-3 border-b border-gray-100 last:border-0">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
            <p className="text-sm text-gray-800">{value ?? '—'}</p>
        </div>
    );
}

export default function Show({ auth, cliente }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Cliente: ${cliente.nombre}`} />

            <div className="py-8 px-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('clientes.index')}
                            className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">{cliente.nombre}</h1>
                    </div>
                    <Link
                        href={route('clientes.edit', cliente.id)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Pencil size={16} /> Editar
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        {cliente.activo ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                                <UserCheck size={16} /> Activo
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-400 font-medium text-sm">
                                <UserX size={16} /> Inactivo
                            </span>
                        )}
                    </div>

                    <Campo label="Nombre completo" value={cliente.nombre} />
                    <Campo label="Teléfono" value={cliente.telefono} />
                    <Campo label="Email" value={cliente.email} />
                    <Campo label="DUI" value={cliente.dui} />
                    <Campo label="Dirección" value={cliente.direccion} />
                    <Campo label="Notas" value={cliente.notas} />
                    <Campo label="Registrado el" value={new Date(cliente.created_at).toLocaleDateString('es-SV')} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function Edit({ auth, usuario, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: usuario.name,
        telefono: usuario.telefono ?? '',
        email: usuario.email,
        password: '',
        password_confirmation: '',
        rol: usuario.roles[0]?.name ?? '',
        activo: usuario.activo,
    });

    function submit(e) {
        e.preventDefault();
        put(route('usuarios.update', usuario.id));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Editar Usuario" />

            <div className="py-8 px-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Usuario</h1>

                <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-4">
                    <Field label="Nombre *" error={errors.name}>
                        <input className={input} value={data.name} onChange={e => setData('name', e.target.value)} />
                    </Field>
                    <Field label="Teléfono" error={errors.telefono}>
                        <input className={input} value={data.telefono} onChange={e => setData('telefono', e.target.value)} />
                    </Field>
                    <Field label="Email *" error={errors.email}>
                        <input type="email" className={input} value={data.email} onChange={e => setData('email', e.target.value)} />
                    </Field>
                    <Field label="Nueva contraseña (dejar vacío para no cambiar)" error={errors.password}>
                        <input type="password" className={input} value={data.password} onChange={e => setData('password', e.target.value)} />
                    </Field>
                    <Field label="Confirmar nueva contraseña" error={errors.password_confirmation}>
                        <input type="password" className={input} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                    </Field>
                    <Field label="Rol *" error={errors.rol}>
                        <select className={input} value={data.rol} onChange={e => setData('rol', e.target.value)}>
                            <option value="">-- Selecciona un rol --</option>
                            {roles.map(rol => (
                                <option key={rol.id} value={rol.name}>{rol.name}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Estado" error={errors.activo}>
                        <select className={input} value={data.activo ? '1' : '0'} onChange={e => setData('activo', e.target.value === '1')}>
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            Actualizar
                        </button>
                        <a href={route('usuarios.index')} className="px-6 py-2 rounded-lg border hover:bg-gray-50">
                            Cancelar
                        </a>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
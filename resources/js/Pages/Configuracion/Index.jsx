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

export default function Index({ auth, usuario }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name:                 usuario.name,
        telefono:             usuario.telefono ?? '',
        email:                usuario.email,
        current_password:     '',
        password:             '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        put(route('configuracion.update'));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Configuración" />

            <div className="py-8 px-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi perfil</h1>

                {recentlySuccessful && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        Perfil actualizado correctamente.
                    </div>
                )}

                <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-4">
                    <h2 className="text-base font-semibold text-gray-700 border-b pb-2">Información personal</h2>

                    <Field label="Nombre *" error={errors.name}>
                        <input className={input} value={data.name} onChange={e => setData('name', e.target.value)} />
                    </Field>
                    <Field label="Teléfono" error={errors.telefono}>
                        <input className={input} value={data.telefono} onChange={e => setData('telefono', e.target.value)} />
                    </Field>
                    <Field label="Email *" error={errors.email}>
                        <input type="email" className={input} value={data.email} onChange={e => setData('email', e.target.value)} />
                    </Field>

                    <h2 className="text-base font-semibold text-gray-700 border-b pb-2 pt-2">Cambiar contraseña</h2>
                    <p className="text-xs text-gray-500">Deja los campos vacíos si no quieres cambiar la contraseña.</p>

                    <Field label="Contraseña actual" error={errors.current_password}>
                        <input type="password" className={input} value={data.current_password} onChange={e => setData('current_password', e.target.value)} />
                    </Field>
                    <Field label="Nueva contraseña" error={errors.password}>
                        <input type="password" className={input} value={data.password} onChange={e => setData('password', e.target.value)} />
                    </Field>
                    <Field label="Confirmar nueva contraseña" error={errors.password_confirmation}>
                        <input type="password" className={input} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
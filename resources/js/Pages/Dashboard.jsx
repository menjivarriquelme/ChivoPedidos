import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Package, Users, ShoppingCart, CreditCard, UserCheck, UserX } from 'lucide-react';

export default function Dashboard({ auth, stats, clientes_recientes, usuarios }) {
    const cards = [
        { name: 'Productos', value: stats.productos, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Clientes', value: stats.clientes, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Pedidos', value: stats.pedidos, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { name: 'Ingresos', value: stats.ingresos, icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-100' },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Resumen general del sistema</p>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((stat) => (
                        <Card key={stat.name}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                        <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Clientes recientes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Clientes recientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {clientes_recientes.length === 0 ? (
                                <p className="text-sm text-gray-500">No hay clientes registrados.</p>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {clientes_recientes.map((cliente) => (
                                        <div key={cliente.id} className="flex items-center justify-between py-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{cliente.nombre}</p>
                                                <p className="text-xs text-gray-500">{cliente.email ?? '—'}</p>
                                            </div>
                                            <div>
                                                {cliente.activo ? (
                                                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                                        <UserCheck size={13} /> Activo
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-red-400 text-xs font-medium">
                                                        <UserX size={13} /> Inactivo
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-4">
                                <Link href={route('clientes.index')} className="text-sm text-blue-600 hover:underline">
                                    Ver todos los clientes →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resumen de usuarios */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen de usuarios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <p className="text-sm text-gray-600">Total de usuarios</p>
                                    <p className="text-sm font-bold text-gray-800">{usuarios.total}</p>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <p className="text-sm text-gray-600">Usuarios activos</p>
                                    <p className="text-sm font-bold text-green-600">{usuarios.activos}</p>
                                </div>
                                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">Usuarios inactivos</p>
                                    <p className="text-sm font-bold text-red-400">{usuarios.total - usuarios.activos}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link href={route('usuarios.index')} className="text-sm text-blue-600 hover:underline">
                                    Ver todos los usuarios →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pedidos recientes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">Aún no hay pedidos registrados.</p>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
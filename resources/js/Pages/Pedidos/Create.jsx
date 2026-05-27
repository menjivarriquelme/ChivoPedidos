import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ clientes, productos }) {

    const [items, setItems] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        cliente_id: '',
        notas: '',
        productos: [],
    });

    const agregarProducto = () => {
        if (!productoSeleccionado) return;

        const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
        if (!producto) return;

        const cantidadNum = parseInt(cantidad);

        if (producto.stock <= 0) {
            alert('Este producto no tiene stock disponible');
            return;
        }

        const existe = items.find(i => i.producto_id === producto.id);

        if (existe) {
            const nuevaCantidad = existe.cantidad + cantidadNum;

            if (nuevaCantidad > producto.stock) {
                alert(`No puedes agregar más de ${producto.stock} unidades`);
                return;
            }
        } else {
            if (cantidadNum > producto.stock) {
                alert(`Solo hay ${producto.stock} unidades disponibles`);
                return;
            }
        }

        let nuevosItems;

        if (existe) {
            nuevosItems = items.map(i =>
                i.producto_id === producto.id
                    ? {
                        ...i,
                        cantidad: i.cantidad + cantidadNum,
                        subtotal: (i.cantidad + cantidadNum) * i.precio_unitario
                    }
                    : i
            );
        } else {
            nuevosItems = [...items, {
                producto_id: producto.id,
                nombre: producto.nombre,
                precio_unitario: producto.precio,
                cantidad: cantidadNum,
                subtotal: producto.precio * cantidadNum,
            }];
        }

        setItems(nuevosItems);
        setData('productos', nuevosItems.map(i => ({
            producto_id: i.producto_id,
            cantidad: i.cantidad
        })));

        setProductoSeleccionado('');
        setCantidad(1);
    };

    const quitarProducto = (producto_id) => {
        const nuevosItems = items.filter(i => i.producto_id !== producto_id);
        setItems(nuevosItems);
        setData('productos', nuevosItems.map(i => ({
            producto_id: i.producto_id,
            cantidad: i.cantidad
        })));
    };

    const total = items.reduce((acc, i) => acc + i.subtotal, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pedidos.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nuevo Pedido" />

            <div className="p-6 md:p-8">

                <div className="flex items-center gap-3 mb-8">
                    <Link
                        href={route('pedidos.index')}
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Nuevo Pedido</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Completa los datos para registrar el pedido</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Datos del pedido</h2>

                        <div className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cliente</label>
                                <select
                                    value={data.cliente_id}
                                    onChange={e => setData('cliente_id', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                >
                                    <option value="" disabled>Seleccionar cliente</option>
                                    {clientes.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                                {errors.cliente_id && <p className="text-xs text-red-500 mt-1">{errors.cliente_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Notas <span className="text-gray-400 font-normal">(opcional)</span>
                                </label>
                                <textarea
                                    value={data.notas}
                                    onChange={e => setData('notas', e.target.value)}
                                    rows={2}
                                    placeholder="Observaciones del pedido..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Productos del pedido</h2>

                        <div className="flex gap-3 mb-4">
                            <select
                                value={productoSeleccionado}
                                onChange={e => setProductoSeleccionado(e.target.value)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                            >
                                <option value="" disabled>Seleccionar producto</option>
                                {productos.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre} — ${Number(p.precio).toFixed(2)} (stock: {p.stock})
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                value={cantidad}
                                onChange={e => setCantidad(e.target.value)}
                                min={1}
                                className="w-20 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />

                            <button
                                type="button"
                                onClick={agregarProducto}
                                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200"
                            >
                                Agregar
                            </button>
                        </div>

                        {errors.productos && <p className="text-xs text-red-500 mb-3">{errors.productos}</p>}

                        {items.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <p className="text-sm">Aún no hay productos en el pedido</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div key={item.producto_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{item.nombre}</p>
                                            <p className="text-xs text-gray-500">
                                                ${Number(item.precio_unitario).toFixed(2)} × {item.cantidad}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-semibold text-gray-800">
                                                ${Number(item.subtotal).toFixed(2)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => quitarProducto(item.producto_id)}
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                                    <span className="text-sm font-semibold text-gray-700">Total del pedido</span>
                                    <span className="text-lg font-bold text-indigo-600">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl"
                        >
                            {processing ? 'Guardando...' : 'Guardar pedido'}
                        </button>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}

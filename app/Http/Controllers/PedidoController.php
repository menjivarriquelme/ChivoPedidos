<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Cliente;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PedidoController extends Controller
{
    // Lista todos los pedidos
    public function index()
    {
        $pedidos = Pedido::with('cliente')
            ->latest()
            ->get()
            ->map(function ($pedido) {
                return [
                    'id'         => $pedido->id,
                    'cliente'    => $pedido->cliente->nombre ?? 'Sin cliente',
                    'total'      => $pedido->total,
                    'estado'     => $pedido->estado,
                    'notas'      => $pedido->notas,
                    'created_at' => $pedido->created_at->format('d/m/Y'),
                ];
            });

        return Inertia::render('Pedidos/Index', [
            'pedidos' => $pedidos,
        ]);
    }

    // Abre el formulario de crear pedido
    public function create()
    {
        $clientes  = Cliente::select('id', 'nombre')->get();
        $productos = Producto::select('id', 'nombre', 'precio', 'stock')->get();

        return Inertia::render('Pedidos/Create', [
            'clientes'  => $clientes,
            'productos' => $productos,
        ]);
    }

    // Guarda el pedido nuevo
    public function store(Request $request)
    {
        $request->validate([
            'cliente_id'               => 'required|exists:clientes,id',
            'notas'                    => 'nullable|string',
            'productos'                => 'required|array|min:1',
            'productos.*.producto_id'  => 'required|exists:productos,id',
            'productos.*.cantidad'     => 'required|integer|min:1',
        ]);

        // Usamos una transacción para que si algo falla, no se guarde nada a medias
        DB::transaction(function () use ($request) {
            $total = 0;

            // Calculamos el total sumando subtotales
            foreach ($request->productos as $item) {
                $producto = Producto::findOrFail($item['producto_id']);
                $total += $producto->precio * $item['cantidad'];
            }

            // Creamos el pedido
            $pedido = Pedido::create([
                'cliente_id' => $request->cliente_id,
                'total'      => $total,
                'estado'     => 'pendiente',
                'notas'      => $request->notas,
            ]);

            // Creamos cada detalle y descontamos stock
            foreach ($request->productos as $item) {
                $producto = Producto::findOrFail($item['producto_id']);

                $pedido->detalles()->create([
                    'producto_id'    => $item['producto_id'],
                    'cantidad'       => $item['cantidad'],
                    'precio_unitario'=> $producto->precio,
                    'subtotal'       => $producto->precio * $item['cantidad'],
                ]);

                // Descontamos del stock
                $producto->decrement('stock', $item['cantidad']);
            }
        });

        return redirect()->route('pedidos.index');
    }

    // Ver detalle de un pedido
    public function show($id)
    {
        $pedido = Pedido::with(['cliente', 'detalles.producto'])->findOrFail($id);

        return Inertia::render('Pedidos/Show', [
            'pedido' => [
                'id'         => $pedido->id,
                'cliente'    => $pedido->cliente->nombre ?? 'Sin cliente',
                'total'      => $pedido->total,
                'estado'     => $pedido->estado,
                'notas'      => $pedido->notas,
                'created_at' => $pedido->created_at->format('d/m/Y H:i'),
                'detalles'   => $pedido->detalles->map(function ($d) {
                    return [
                        'id'              => $d->id,
                        'producto'        => $d->producto->nombre ?? 'Sin producto',
                        'cantidad'        => $d->cantidad,
                        'precio_unitario' => $d->precio_unitario,
                        'subtotal'        => $d->subtotal,
                    ];
                }),
            ],
        ]);
    }

    // Cambia el estado del pedido
    public function update(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,en_proceso,entregado,cancelado',
        ]);

        $pedido = Pedido::findOrFail($id);

        // Si se cancela, devolvemos el stock
        if ($request->estado === 'cancelado' && $pedido->estado !== 'cancelado') {
            foreach ($pedido->detalles as $detalle) {
                $detalle->producto->increment('stock', $detalle->cantidad);
            }
        }

        $pedido->update(['estado' => $request->estado]);

        return redirect()->route('pedidos.index');
    }

    // Elimina un pedido (solo si está pendiente o cancelado)
    public function destroy($id)
    {
        $pedido = Pedido::with('detalles')->findOrFail($id);

        if (!in_array($pedido->estado, ['pendiente', 'cancelado'])) {
            return back()->withErrors(['error' => 'Solo se pueden eliminar pedidos pendientes o cancelados.']);
        }

        // Si está pendiente, devolvemos el stock antes de eliminar
        if ($pedido->estado === 'pendiente') {
            foreach ($pedido->detalles as $detalle) {
                $detalle->producto->increment('stock', $detalle->cantidad);
            }
        }

        $pedido->delete();

        return redirect()->route('pedidos.index');
    }
}

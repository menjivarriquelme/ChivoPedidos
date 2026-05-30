<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\PedidoController;
use Inertia\Inertia;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\User;
use App\Http\Controllers\CategoriaController;

// ─── Rutas públicas (invitados) ─────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// ─── Rutas protegidas (autenticados) ────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/', function () {
        return redirect('/dashboard');
    });

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'stats' => [
                'productos' => Producto::count(),
                'clientes'  => Cliente::count(),
                'pedidos'   => Pedido::count(),
                'ingresos'  => '$' . number_format(
                    Pedido::where('estado', 'entregado')->sum('total'), 2
                ),
            ],
            'clientes_recientes' => Cliente::latest()->take(5)->get(),
            'usuarios' => [
                'total'   => User::count(),
                'activos' => User::where('activo', true)->count(),
            ],
        ]);
    })->name('dashboard');

    // ─── Productos ──────────────────────────────────────
    Route::resource('productos', ProductoController::class);

    // ─── Pedidos ────────────────────────────────────────
    Route::resource('pedidos', PedidoController::class);

    // ─── Clientes ───────────────────────────────────────
    Route::middleware('permission:clientes.ver')->group(function () {
        Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
        Route::get('/clientes/{cliente}/edit', [ClienteController::class, 'edit'])->name('clientes.edit');
        Route::put('/clientes/{cliente}', [ClienteController::class, 'update'])->name('clientes.update');
        Route::get('/clientes/{cliente}', [ClienteController::class, 'show'])->name('clientes.show');
    });

    Route::middleware('permission:clientes.crear')->group(function () {
        Route::get('/clientes/create', [ClienteController::class, 'create'])->name('clientes.create');
        Route::post('/clientes', [ClienteController::class, 'store'])->name('clientes.store');
    });

    // ─── Usuarios ───────────────────────────────────────
    Route::middleware('permission:usuarios.crear')->group(function () {
        Route::get('/usuarios/create', [UsuarioController::class, 'create'])->name('usuarios.create');
        Route::post('/usuarios', [UsuarioController::class, 'store'])->name('usuarios.store');
    });

    Route::middleware('permission:usuarios.ver')->group(function () {
        Route::get('/usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
        Route::get('/usuarios/{usuario}', [UsuarioController::class, 'show'])->name('usuarios.show');
        Route::get('/usuarios/{usuario}/edit', [UsuarioController::class, 'edit'])->name('usuarios.edit');
        Route::put('/usuarios/{usuario}', [UsuarioController::class, 'update'])->name('usuarios.update');
        Route::patch('/usuarios/{usuario}/toggle', [UsuarioController::class, 'toggleActivo'])->name('usuarios.toggle');
    });

    // ─── Categorias ─────────────────────────────────────
    Route::resource('categorias', CategoriaController::class);

    Route::patch(
        '/categorias/{id}/estado',
        [CategoriaController::class, 'cambiarEstado']
    )->name('categorias.cambiarEstado');
});

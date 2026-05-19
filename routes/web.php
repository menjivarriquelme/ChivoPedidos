<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\UsuarioController;
use Inertia\Inertia;

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
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // ─── Productos ──────────────────────────────────────
    Route::resource('productos', ProductoController::class);

    // ─── Clientes ───────────────────────────────────────
    Route::middleware('permission:clientes.ver')->group(function () {
        Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index'); //vista
        Route::get('/clientes/{cliente}/edit', [ClienteController::class, 'edit'])->name('clientes.edit');//clientes editar
        Route::put('/clientes/{cliente}', [ClienteController::class, 'update'])->name('clientes.update'); //actualizacion
        Route::get('/clientes/{cliente}', [ClienteController::class, 'show'])->name('clientes.show'); //visualizacion 
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
});
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UsuarioController extends Controller
{
    public function index()//este consulta todos los usuarios con sus roles, ordenados por nombre y los manda a la vista
    {
        $usuarios = User::with('roles')->orderBy('name')->get();

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function create()//aqui trae todos los roles disponibles de la base de datos y los manda al formulario 
    {
        $roles = Role::all();

        return Inertia::render('Usuarios/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)//valida los datos del usuario y le asigna el rol ssignRole
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'rol'      => 'required|string|exists:roles,name',
        ]);

        $usuario = User::create([
            'name'     => $validated['name'],
            'telefono' => $validated['telefono'] ?? null,
            'email'    => $validated['email'],
            'password' => $validated['password'],
            'activo'   => true,
        ]);

        $usuario->assignRole($validated['rol']);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function show(User $usuario)/// busca los usuarios por id y los manda a la vista de detalles 
    {
        $usuario->load('roles');

        return Inertia::render('Usuarios/Show', [
            'usuario' => $usuario,
        ]);
    }

    public function edit(User $usuario)//igual que show pero también trae todos los roles disponibles para el selector
    {
        $usuario->load('roles');
        $roles = Role::all();

        return Inertia::render('Usuarios/Edit', [
            'usuario' => $usuario,
            'roles'   => $roles,
        ]);
    }

    public function update(Request $request, User $usuario)///alida y actualiza los datos. La contraseña es opcional al editar — si el admin no escribe una nueva, se queda la anterior 
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'email'    => 'required|email|unique:users,email,' . $usuario->id,
            'password' => 'nullable|string|min:8|confirmed',
            'rol'      => 'required|string|exists:roles,name',
        ]);

        $usuario->update([
            'name'     => $validated['name'],
            'telefono' => $validated['telefono'] ?? null,
            'email'    => $validated['email'],
            'password' => $validated['password'] ?? $usuario->password,
        ]);

        $usuario->syncRoles([$validated['rol']]);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function toggleActivo(User $usuario)//invierte el estado a activo e inactivo
    {
        $usuario->update(['activo' => !$usuario->activo]);

        $mensaje = $usuario->activo ? 'Usuario activado.' : 'Usuario inactivado.';

        return redirect()->route('usuarios.index')
            ->with('success', $mensaje);
    }
}

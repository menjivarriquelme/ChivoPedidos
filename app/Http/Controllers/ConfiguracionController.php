<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index()
    {
        return Inertia::render('Configuracion/Index', [
            'usuario' => Auth::user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'                 => 'required|string|max:255',
            'telefono'             => 'nullable|string|max:20',
            'email'                => 'required|email|unique:users,email,' . $user->id,
            'password'             => 'nullable|string|min:8|confirmed',
            'current_password'     => 'nullable|string',
        ]);

        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return back()->withErrors(['current_password' => 'La contraseña actual no es correcta.']);
            }
            $user->password = $validated['password'];
        }

        $user->name     = $validated['name'];
        $user->telefono = $validated['telefono'] ?? null;
        $user->email    = $validated['email'];
        $user->save();

        return redirect()->route('configuracion.index')
            ->with('success', 'Perfil actualizado correctamente.');
    }
}
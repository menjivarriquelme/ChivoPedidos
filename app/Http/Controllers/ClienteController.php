<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::orderBy('nombre')->get();

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Clientes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'    => 'required|string|max:255',
            'telefono'  => 'nullable|string|max:20',
            'email'     => 'nullable|email|unique:clientes,email',
            'direccion' => 'nullable|string|max:255',
            'dui'       => 'nullable|string|max:10|unique:clientes,dui',
            'notas'     => 'nullable|string',
            'activo'    => 'required',
        ]);

        Cliente::create($validated);

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente creado correctamente.');
    }

    public function edit(Cliente $cliente)
    {
        return Inertia::render('Clientes/Edit', [
            'cliente' => $cliente,
        ]);
    }

    public function update(Request $request, Cliente $cliente)
    {
        $validated = $request->validate([
            'nombre'    => 'required|string|max:255',
            'telefono'  => 'nullable|string|max:20',
            'email'     => 'nullable|email|unique:clientes,email,' . $cliente->id,
            'direccion' => 'nullable|string|max:255',
            'dui'       => 'nullable|string|max:10|unique:clientes,dui,' . $cliente->id,
            'notas'     => 'nullable|string',
            'activo'    => 'boolean',
        ]);

        $cliente->update($validated);

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente actualizado correctamente.');

            
    }

        public function show(Cliente $cliente) //metodo show controlador 
    {
        return Inertia::render('Clientes/Show', [
            'cliente' => $cliente,
        ]);
    }
}
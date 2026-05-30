<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    // Mostrar listado
    public function index()
    {
        $categorias = Categoria::all();

        return Inertia::render('categorias/Index', [
            'categorias' => $categorias
        ]);
    }

    // Vista crear categoría
    public function create()
    {
        return Inertia::render('categorias/Create');
    }

    // Guardar categoría
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'estado' => 'required|in:activo,inactivo',
        ]);

        Categoria::create([
            'nombre' => $request->nombre,
            'estado' => $request->estado,
        ]);

        return redirect()
            ->route('categorias.index')
            ->with('success', 'Categoría creada correctamente');
    }

    // Vista editar categoría
    public function edit($id)
    {
        $categoria = Categoria::findOrFail($id);

        return Inertia::render('categorias/Edit', [
            'categoria' => $categoria
        ]);
    }

    // Actualizar categoría
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'estado' => 'required|in:activo,inactivo',
        ]);

        $categoria = Categoria::findOrFail($id);

        $categoria->update([
            'nombre' => $request->nombre,
            'estado' => $request->estado,
        ]);

        return redirect()
            ->route('categorias.index')
            ->with('success', 'Categoría actualizada correctamente');
    }

    // Eliminar categoría
    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);

        $categoria->delete();

        return redirect()
            ->route('categorias.index')
            ->with('success', 'Categoría eliminada correctamente');
    }
}

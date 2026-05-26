<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = [
        'cliente_id',
        'total',
        'estado',
        'notas',
    ];

    // Un pedido pertenece a un cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    // Un pedido tiene muchos detalles (productos)
    public function detalles()
    {
        return $this->hasMany(DetallePedido::class);
    }
}

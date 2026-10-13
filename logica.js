// Disponemos en la caja del siguiente dinero distribuido de la siguiente manera: 234,27 €
// (información que se debe cargar en un array)
//========================================================================
//FASE 1 (BLOQUE 1): PREPARAR DATOS

  // { valor: 50000, stock: 0 }, // -Billetes de 500€: 0
  // { valor: 20000, stock: 0 }, // -Billetes de 200€: 0
  // { valor: 10000, stock: 0 }, // -Billetes de 100€: 0
  // { valor: 5000, stock: 1 }, // -Billetes de 50€: 1
  // { valor: 2000, stock: 4 }, // -Billetes de 20€: 4
  // { valor: 1000, stock: 8 }, // -Billetes de 10€: 8
  // { valor: 500, stock: 2 }, // -Billetes de 5€: 2
  // { valor: 200, stock: 5 }, // -Monedas de 2€: 5
  // { valor: 100, stock: 4 }, // -Monedas de 1€: 4
  // { valor: 50, stock: 0 }, // -Monedas de 0.50€: 0
  // { valor: 20, stock: 0 }, // -Monedas de 0.20€: 0
  // { valor: 10, stock: 1 }, // -Monedas de 0.10€: 1
  // { valor: 5, stock: 2 }, // -Monedas de 0.05€: 2
  // { valor: 2, stock: 3 }, // -Monedas de 0.02€: 3
  // { valor: 1, stock: 1 }, // -Monedas de 0.01€: 1


export function reinicioCaja() {
  return [
    { valor: 50000, stock: 0 },
    { valor: 20000, stock: 0 },
    { valor: 10000, stock: 0 },
    { valor: 5000, stock: 1 },
    { valor: 2000, stock: 4 },
    { valor: 1000, stock: 8 },
    { valor: 500, stock: 2 },
    { valor: 200, stock: 5 },
    { valor: 100, stock: 4 },
    { valor: 50, stock: 0 },
    { valor: 20, stock: 0 },
    { valor: 10, stock: 1 },
    { valor: 5, stock: 2 },
    { valor: 2, stock: 3 },
    { valor: 1, stock: 1 },
  ];
}

export let caja = reinicioCaja();

// Función para que dom.js pueda pedir el reinicio sin reasignar "caja" directamente desde fuera
export function reiniciarCajaReal() {
  caja = reinicioCaja();
}

// Calcula el valor total acumulado en la caja, en céntimos
export function totalCaja() {
  let total = 0;
  for (let i = 0; i < caja.length; i++) {
    total += caja[i].valor * caja[i].stock;
  }
  return total;
}
//========================================================================

// FASE 2 (BLOQUE 2): COMPROBAR EL PAGO

// Función principal que simula una venta
export function procesarVenta(precio, pago) {
  // Transformamos el precio y el pago a céntimos para evitar problemas con los decimales
  let centimos = precio * 100;

  let pagado = 0;

  for (let i = 0; i < caja.length; i++) {
    pagado += pago[i] * caja[i].valor; //Cuanto ha pagado el cliente en total * 100
  }
  console.log(`- Nueva Venta: Precio = ${precio}€ | Pagado = ${pagado / 100}€ -`);

  if (pagado < centimos) {
    let mensaje = "El pago es insuficiente. Fiamos ayer y fiamos mañana, pero hoy no, vuelva otro día.";
    console.log(mensaje);
    return mensaje; // NUEVO
  }
  if (pagado === centimos) {
    for (let i = 0; i < caja.length; i++) {
      caja[i].stock += pago[i]; // Actualizamos el stock de la caja con el pago recibido
    }
    let mensaje = "El pago es exacto. No hay cambio que devolver. Añado dinero a la caja. Que tenga un buen día.";
    console.log(mensaje);
    return mensaje; // NUEVO
  }
  //========================================================================
  // FASE 3 (BLOQUE 3): CALCULAR EL CAMBIO

  let copiaCaja = [];
  for (let i = 0; i < caja.length; i++) {
    copiaCaja[i] = { valor: caja[i].valor, stock: caja[i].stock }; // Creo una copia de la caja para no modificar el stock original mientras calculo el cambio por si falla.
    copiaCaja[i].stock += pago[i];
  }

  let cambioDinero = pagado - centimos;

  // FASE 4: devolver está anidada aquí dentro para que pueda usar copiaCaja
  function devolver(cambio, i) {
    if (cambio === 0) {
      return true; //ÉXITO: ya no queda cambio por devolver, todo se ha asignado correctamente.
    }
    if (i >= copiaCaja.length) {
      return false; //FRACASO: hemos recorrido todos los tipos de billete y todavía queda cambio sin devolver.
    }

    // Calculamos cuántas unidades de esta denominación podemos entregar como máximo:
    // primero vemos cuántas caben en el cambio restante sin pasarnos (maxValor),
    // y luego nos quedamos con el valor más bajo entre eso y el stock real disponible (minValor),
    // Son 2 variables que son dos restricciones a la vez: no pasarnos del cambio, y no usar más de lo que hay en stock.
    let maxValor = Math.floor(cambio / copiaCaja[i].valor); //Cuántas unidades de este Billete/moneda puedo darle en el cambio, sin pasarme.
    let minValor = Math.min(maxValor, copiaCaja[i].stock); //El número real de cuantos billete/moneda dar en el cambio: el menor entre lo que cabe y lo que hay en stock.

    while (minValor >= 0) {
      copiaCaja[i].stock -= minValor;
      cambio -= minValor * copiaCaja[i].valor;

      if (devolver(cambio, i + 1)) {
        // Si tuvo éxito, terminamos
        return true;
      }

      // Si falló el true entonces deshacer el intento (Backtracking)
      copiaCaja[i].stock += minValor;
      cambio += minValor * copiaCaja[i].valor;

      // Probar con una unidad menos en la siguiente vuelta
      minValor--;
    }

    return false; // Ninguna cantidad de esta denominación llevó a una solución
  }

  let exito = devolver(cambioDinero, 0);

  if (!exito) {
    let mensaje = "No tengo cambio suficiente para completar esta venta. Lo siento.";
    console.log(mensaje);
    return mensaje;
  }

  let mensaje = `Le devuelvo ${cambioDinero / 100}€ de la siguiente manera: `;
  for (let i = 0; i < caja.length; i++) {
    let entregado = (caja[i].stock + pago[i]) - copiaCaja[i].stock;
    if (entregado > 0) {
      mensaje += `${entregado} de ${caja[i].valor / 100}€, `;
    }
  }
  console.log(mensaje);

  caja = copiaCaja;
  return mensaje; 
}



//======================Prueba de 6 casos para cubrir todas las posibilidades============================

// caja = reinicioCaja();
// procesarVenta(20, [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0]);

// caja = reinicioCaja();
// procesarVenta(20, [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0]);

// caja = reinicioCaja();
// procesarVenta(7, [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0]);

// caja = reinicioCaja();
// procesarVenta(19.80, [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0]);

// caja = reinicioCaja();
// procesarVenta(7.30, [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0]);

// caja = reinicioCaja();
// procesarVenta(20, [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0]);

//No ponemos console.log porque dentro de las funciones ya tienen sus propios console.log, porque el return no devuelve
//un valor si no que simplemente corta la ejecución, saldría undefined

//let pago = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];  //Array que representa el pago realizado por el cliente,
//donde cada posición corresponde a un tipo de billete o moneda en la caja.
// En la posición 4 indica que se ha pagado con un billete de 20€.

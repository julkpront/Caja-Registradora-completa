import { procesarVenta, reiniciarCajaReal, totalCaja } from "./logica.js";

let resultadoDiv = document.getElementById("resultado");
let totalCajaDiv = document.getElementById("totalCaja");

function mostrarTotalCaja() {
  totalCajaDiv.textContent = `Total en caja: ${(totalCaja() / 100).toFixed(2)}€`;
}

function leerPago() {
  return [
    Number(document.getElementById("pago500").value),
    Number(document.getElementById("pago200").value),
    Number(document.getElementById("pago100").value),
    Number(document.getElementById("pago50").value),
    Number(document.getElementById("pago20").value),
    Number(document.getElementById("pago10").value),
    Number(document.getElementById("pago5").value),
    Number(document.getElementById("pago2").value),
    Number(document.getElementById("pago1").value),
    Number(document.getElementById("pago050").value),
    Number(document.getElementById("pago020").value),
    Number(document.getElementById("pago010").value),
    Number(document.getElementById("pago005").value),
    Number(document.getElementById("pago002").value),
    Number(document.getElementById("pago001").value),
  ];
}

document.getElementById("btnProcesar").addEventListener("click", function () {
  let precio = Number(document.getElementById("precio").value);
  let pago = leerPago();
  let mensaje = procesarVenta(precio, pago);
  resultadoDiv.textContent = mensaje;
  mostrarTotalCaja();
});

document.getElementById("btnReiniciar").addEventListener("click", function () {
  reiniciarCajaReal();
  resultadoDiv.textContent = "Caja reiniciada a sus valores originales.";
  mostrarTotalCaja();
});

mostrarTotalCaja();
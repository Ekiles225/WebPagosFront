import { Component } from '@angular/core';
import { PagosService } from '../Servicios/pagos.service';


@Component({
  selector: 'app-historial-de-pagos',
  standalone: true,
  imports: [],
  templateUrl: './historial-de-pagos.component.html',
  styleUrl: './historial-de-pagos.component.css'
})
export class HistorialDePagosComponent {

  constructor(private pagoS: PagosService) {}
  listPagos: any[] = [];

  ngOnInit() {
    this.obtenerPagos();
  }

  obtenerPagos() {
    this.pagoS.getPagos().subscribe({
      next: (data: any) => {
        console.log("Datos de pagos recibidos:", data); // Depuración
        this.listPagos = data; // Ya incluye cliente
      },
      error: (error) => {
        console.error('Error al obtener pagos:', error);
      }
    });
  }

}

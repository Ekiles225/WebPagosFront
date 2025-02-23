import { Component } from '@angular/core';
import { ClienteService } from '../Servicios/cliente.service';
import { DasbhoarService } from '../Servicios/dasbhoar.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private dasbhoar: DasbhoarService) {}

  listCliente: any = [] = [];


  
  ngOnInit() {
    this.obtenerClientes(); // Llamar al cargar la página para llenar la tabla
  }

  obtenerClientes() {
    this.dasbhoar.getClientess().subscribe({
      next: (data: any) => {
        this.listCliente = data.Clientes;
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }
}

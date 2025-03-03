import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagosService } from '../Servicios/pagos.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ClienteService } from '../Servicios/cliente.service';
import { PrestamosService } from '../Servicios/prestamos.service';


@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagosComponent {

  listPagos: any[] = [];
  modalAbierto: boolean = false;
  modoEdicion: boolean = false; // Indica si el modal está en modo edición
  pagoSeleccionado: any = {
    id: null,
    monto_pagado: null,
    fecha_pago: '',
    saldo_restante: null,
    prestamo_id: null
  };
  listPrestamos: any[] = [];
  listcliente: any;

  clienteSeleccionadoId: number | null = null; // Almacena el ID del cliente seleccionado
  listPagosFiltrados: any[] = [];


  constructor(private pagosS: PagosService, private prestamosS: PrestamosService, private clienteS: ClienteService) {}

  ngOnInit() {
    this.obtenerPagos(); // Llenar la lista al cargar la página
    this.obtenerPrestamos();
    this.obtenerCliente();
    this.filtrarPagosPorCliente();
  }


  
  // Método para abrir el modal (nuevo o edición)
  abrirModal(pago?: any) {
    if (pago) {
      // Modo edición: Rellenar el formulario con los datos del pago
      this.pagoSeleccionado = { ...pago };
      this.modoEdicion = true;
    } else {
      // Modo registro: Limpiar el formulario
      this.pagoSeleccionado = {
        id: null,
        monto_pagado: null,
        fecha_pago: '',
        saldo_restante: null,
        prestamo_id: null
      };
      this.modoEdicion = false;
    }
    this.modalAbierto = true; // Abrir el modal
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.modalAbierto = false;
  }

  // Método para guardar (registrar o editar)
  guardarPago() {
    if (this.modoEdicion) {
      // Modo edición: Llamar al método de actualización
      this.pagosS.updatePagos(this.pagoSeleccionado.id, this.pagoSeleccionado).subscribe({
        next: (data) => {
          console.log("Pago actualizado con éxito:", data);
          alert("Pago actualizado con éxito");
          this.obtenerPagos(); // Refrescar la lista
          this.cerrarModal(); // Cerrar el modal
        },
        error: (error) => {
          console.error("Error al actualizar pago:", error);
          alert("Hubo un error al actualizar el pago.");
        }
      });
    } else {
      // Modo registro: Llamar al método de registro
      this.pagosS.storePagos(
        this.pagoSeleccionado.prestamo_id,
        this.pagoSeleccionado.monto_pagado,
        this.pagoSeleccionado.fecha_pago,
        this.pagoSeleccionado.saldo_restante
      ).subscribe({
        next: (data) => {
          console.log("Pago registrado con éxito:", data);
          alert("Pago registrado con éxito");
          this.obtenerPagos(); // Refrescar la lista
          this.cerrarModal(); // Cerrar el modal
        },
        error: (error) => {
          console.error("Error al registrar pago:", error);
          alert("Hubo un error al registrar el pago.");
        }
      });
    }
  }

  // Método para obtener la lista de pagos
  obtenerPagos() {
    this.pagosS.getPagos().subscribe({
      next: (data: any) => {
        this.listPagos = data;
        console.log('Lista de pagos:', this.listPagos); // Depuración
        this.filtrarPagosPorCliente(); // Llamar al filtrado después de obtener los pagos
      },
      error: (error) => {
        console.error('Error al obtener pagos:', error);
      }
    });
  }

  filtrarPagosPorCliente() {
    if (!this.clienteSeleccionadoId) {
      this.listPagosFiltrados = this.listPagos; // Si no hay cliente seleccionado, mostrar todos los pagos
    } else {
      this.listPagosFiltrados = this.listPagos.filter(pago => pago.Prestamo?.Cliente?.id === this.clienteSeleccionadoId);
    }
    console.log('Pagos filtrados:', this.listPagosFiltrados); // Depuración
  }



obtenerPrestamos() {
  this.prestamosS.getPrestamosYClientes().subscribe({
    next: (data: any) => {
      console.log("Datos de préstamos recibidos:", data); // Depuración
      this.listPrestamos = data.prestamos; // Ya incluye cliente
    },
    error: (error) => {
      console.error('Error al obtener préstamos:', error);
    }
  });
}



obtenerCliente() {
  this.clienteS.getCliente().subscribe({
    next: (data: any) => {
      console.log("Datos de cliente recibidos:", data); // Depuración
      this.listcliente = data.clientes; // Ya incluye cliente
    },
    error: (error) => {
      console.error('Error al obtener préstamos:', error);
    }
  });
}

  // Método para eliminar un pago
  eliminarPago(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      this.pagosS.eliminarPagos(id).subscribe({
        next: (data) => {
          console.log("Pago eliminado:", data);
          alert('Pago eliminado con éxito.');
          this.obtenerPagos(); // Refrescar la lista
        },
        error: (error) => {
          console.error("Error al eliminar pago:", error);
        }
      });
    }
  }

  
}

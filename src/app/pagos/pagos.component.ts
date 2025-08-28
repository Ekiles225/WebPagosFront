import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PagosService } from '../Servicios/pagos.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgClass, NgIf, NgFor } from '@angular/common';
import { ClienteService } from '../Servicios/cliente.service';
import { PrestamosService } from '../Servicios/prestamos.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, NgClass, DatePipe, NgIf, NgFor],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PagosComponent {

  listPagos: any[] = [];
  listPrestamos: any[] = [];
  listcliente: any;

  modalAbierto: boolean = false;
  modoEdicion: boolean = false; // Indica si el modal está en modo edición

  pagoSeleccionado: any = {
    id: null,
    monto_pagado: null,
    fecha_pago: '',
    saldo_restante: null,
    prestamo_id: null
  };


  clienteSeleccionadoId: number | null = null; // Almacena el ID del cliente seleccionado
  listPagosFiltrados: any[] = [];

// ...existing code...
filtro: string = '';
currentPage: number = 1;
itemsPerPage: number = 5;
totalPages: number = 0;
filteredPagos: any[] = [];
paginatedPagos: any[] = [];
// ...existing code...

  constructor(private pagosS: PagosService, private clienteS: ClienteService,  private cdr: ChangeDetectorRef, private prestamosS: PrestamosService) { }

  ngOnInit() {
    this.obtenerPagos(); // Llenar la lista al cargar la página
    this.obtenerCliente();
    this.obtenerPrestamos(); // Llenar la lista de préstamos al cargar la página
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
    this.pagoSeleccionado = {
      id: null,
      monto_pagado: null,
      fecha_pago: '',
      saldo_restante: null,
      prestamo_id: null
    };
  }

  // Método para guardar (registrar o editar)
  guardarPago() {
    if (this.modoEdicion) {
      this.pagosS.updatePagos(this.pagoSeleccionado.id, this.pagoSeleccionado).subscribe({
        next: (data) => {
          console.log("Pago actualizado con éxito:", data);
          alert("Pago actualizado con éxito");
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3701389040.
          this.cerrarModal();
          this.cdr.detectChanges();
          this.obtenerPagos();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error("Error al actualizar pago:", error);
          alert("Hubo un error al actualizar el pago.");
        }
      });
    } else {
      this.pagosS.storePagos(
        this.pagoSeleccionado.prestamo_id,
        this.pagoSeleccionado.monto_pagado,
        this.pagoSeleccionado.fecha_pago,
        this.pagoSeleccionado.saldo_restante
      ).subscribe({
        next: (data) => {
          console.log("Pago registrado con éxito:", data);
          alert("Pago registrado con éxito");
          this.cdr.detectChanges();
          this.obtenerPagos();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error("Error al registrar pago:", error);
          alert("Hubo un error al registrar el pago.");
        }
      });
    }
  }

  // Método para limpiar el formulario después de guardar o editar
  limpiarFormulario() {
    this.pagoSeleccionado = {
      id: null,
      monto_pagado: null,
      fecha_pago: '',
      saldo_restante: null,
      prestamo_id: null
    };
  }

  // Método para obtener la lista de pagos
  obtenerPagos() {
    this.pagosS.getPagos().subscribe({
      next: (data: any) => {
        this.listPagos = data;
         this.applyPagosFilters();
        this.listPagosFiltrados = [...this.listPagos]; // Asegura que se carguen los datos correctamente
        console.log('Lista de pagos cargada:', this.listPagosFiltrados);
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Error al obtener pagos:', error);
      }
    });
  }

  obtenerPrestamos() {
    this.prestamosS.getPrestamosYClientes().subscribe({
      next: (data: any) => {
        console.log("Datos de préstamos recibidos:", data); // Depuración
        this.listPrestamos = data.prestamos; // Ya incluye cliente
        this.cdr.detectChanges(); 

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
        this.cdr.detectChanges();
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

  // Método para la paginacion 

  applyPagosFilters() {
  if (this.filtro.trim() === '') {
    this.filteredPagos = [...this.listPagos];
  } else {
    const searchTerm = this.filtro.toLowerCase();
    this.filteredPagos = this.listPagos.filter(pago =>
      (pago.cliente?.nombre?.toLowerCase().includes(searchTerm) || '') ||
      (pago.descripcion?.toLowerCase().includes(searchTerm) || '')
    );
  }
  this.currentPage = 1;
  this.updatePagosPagination();
}

updatePagosPagination() {
  this.totalPages = Math.ceil(this.filteredPagos.length / this.itemsPerPage);
  this.updatePaginatedPagos();
}

updatePaginatedPagos() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedPagos = this.filteredPagos.slice(startIndex, endIndex);
}

changePagosPage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.updatePaginatedPagos();
}

previousPagosPage() {
  if (this.currentPage > 1) {
    this.changePagosPage(this.currentPage - 1);
  }
}

nextPagosPage() {
  if (this.currentPage < this.totalPages) {
    this.changePagosPage(this.currentPage + 1);
  }
}

getPagosPageRange(): number[] {
  const range: number[] = [];
  const maxPages = 5;
  let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
  let end = Math.min(this.totalPages, start + maxPages - 1);
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1);
  }
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
}

getPagosPaginationInfo(): string {
  const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
  const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredPagos.length);
  return `Mostrando ${startItem}-${endItem} de ${this.filteredPagos.length} pagos`;
}

}

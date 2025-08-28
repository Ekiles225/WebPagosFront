import { Component } from '@angular/core';
import { PrestamosService, Prestamo } from '../Servicios/prestamos.service';
import { FormsModule } from '@angular/forms';
import {  NgClass,DecimalPipe, NgIf, DatePipe , NgFor} from '@angular/common';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [FormsModule, DecimalPipe, NgClass, DatePipe, NgIf, NgFor],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css'],
   providers: [DecimalPipe]
})
export class PrestamosComponent {
  listPrestamos: any[] = [];
  lisClientes: any[] = [];
  modalAbierto: boolean = false;
  modoEdicion: boolean = false;

montoTotal: number = 0;

 // Array to hold all loans fetched from the backend
  prestamos: Prestamo[] = [];
  // Object to hold the data of the loan currently being edited or created
  prestamoSeleccionado: Prestamo = {
    cliente_id: '',
    monto: 0,
    tasa_interes: 0,
    fecha_inicio: '',
    fecha_vencimiento: '',
    estado: 'pendiente', // Default state
    descripcion: ''
  };
 
  // Variables for custom alert messages
  mensajeAlerta: string = '';
  mostrarAlerta: boolean = false;
  esError: boolean = false; // To apply different styles for error messages

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  filtro: string = ''; // Filter for search functionality

  // Variables for filtered and paginated loans
filteredPrestamos: any[] = [];
paginatedPrestamos: any[] = [];
// ...existing code...

  constructor(private prestamosS: PrestamosService) {}

  ngOnInit() {
    this.obtenerPrestamos();
    this.obtenerClientes();
  }

 abrirModal(prestamo?: Prestamo): void {
    if (prestamo) {
      this.modoEdicion = true;
      // Create a copy to avoid directly modifying the table data before saving
      this.prestamoSeleccionado = { ...prestamo };
    } else {
      this.modoEdicion = false;
      // Reset the form for a new loan
      this.prestamoSeleccionado = {
        cliente_id: '',
        monto: 0,
        tasa_interes: 0,
        fecha_inicio: '',
        fecha_vencimiento: '',
        estado: 'pendiente',
        descripcion: ''
      };
    }
    this.modalAbierto = true;
    this.ocultarMensaje(); // Hide any previous alerts when opening modal
  }
ocultarMensaje(): void {
    this.mostrarAlerta = false;
    this.mensajeAlerta = '';
    this.esError = false;
  }

  guardarPrestamo(): void {
    // Frontend validation for required fields
    if (
      !this.prestamoSeleccionado.cliente_id ||
      this.prestamoSeleccionado.monto === null || this.prestamoSeleccionado.monto <= 0 ||
      this.prestamoSeleccionado.tasa_interes === null || this.prestamoSeleccionado.tasa_interes < 0 ||
      !this.prestamoSeleccionado.fecha_inicio ||
      !this.prestamoSeleccionado.fecha_vencimiento
    ) {
      this.mostrarMensaje("Todos los campos obligatorios (ID Cliente, Monto, Tasa de Interés, Fecha Inicio, Fecha Vencimiento) deben ser completados.", true);
      return;
    }

    if (this.modoEdicion && this.prestamoSeleccionado.id) {
      // Update existing loan
      this.prestamosS.updatePrestamo(this.prestamoSeleccionado.id, this.prestamoSeleccionado).subscribe({
        next: (data) => {
          console.log("Préstamo actualizado con éxito:", data);
          this.mostrarMensaje("Préstamo actualizado con éxito.");
          this.obtenerPrestamos(); // Refresh the list
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al actualizar préstamo:", error);
          this.mostrarMensaje("Hubo un error al actualizar el préstamo.", true);
        }
      });
    } else {
      // Create new loan
      this.prestamosS.storePrestamos(this.prestamoSeleccionado).subscribe({
        next: (data) => {
          console.log("Préstamo registrado con éxito:", data);
          this.mostrarMensaje("Préstamo registrado con éxito.");
          this.obtenerPrestamos(); // Refresh the list
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al registrar préstamo:", error);
          // Check if the error message from the backend is available
          if (error.status === 400 && error.error && error.error.mensaje) {
            this.mostrarMensaje(error.error.mensaje, true); // Display backend's specific error
          } else {
            this.mostrarMensaje("Hubo un error al registrar el préstamo.", true);
          }
        }
      });
    }
  }

   mostrarMensaje(message: string, isError: boolean = false): void {
    this.mensajeAlerta = message;
    this.esError = isError;
    this.mostrarAlerta = true;
    // Automatically hide the message after 5 seconds
    setTimeout(() => {
      this.ocultarMensaje();
    }, 5000);
  }


cerrarModal(): void {
    this.modalAbierto = false;
    this.modoEdicion = false;
    this.ocultarMensaje(); // Hide any alerts
  }

  obtenerPrestamos() {
    this.prestamosS.getPrestamosYClientes().subscribe({
      next: (data: any) => {
        this.listPrestamos = data.prestamos;
        this.applyPrestamosFilters();
      },
      error: (error) => {
        console.error('Error al obtener préstamos:', error);
      }
    });
  }

 getStatusClass(estado: any): string {
  if (typeof estado === 'string') {
    return estado.toLowerCase() === 'pagado' ? 'status-active' : 'status-inactive';
  }
  return estado === true ? 'status-active' : 'status-inactive';
}

    getPrestamoStatus(pagado: any): string {
    const isActive = pagado === true || pagado === 'true';
    return isActive ? 'Pagado' : 'Pendiente';
  }


obtenerClientes() {
    this.prestamosS.getCliente().subscribe({
      next: (data: any) => {
        this.lisClientes = data.clientes;
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }

  eliminarPrestamo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
      this.prestamosS.eliminarPrestamos(id).subscribe({
        next: (data) => {
          console.log("Préstamo eliminado:", data);
          alert('Préstamo eliminado con éxito.');
          this.obtenerPrestamos();
        },
        error: (error) => {
          console.error("Error al eliminar préstamo:", error);
        }
      });
    }
  }
  
  

// esta es la seccion de las tarjetas de estadisticas

totalPrestamos(): number {
  return this.listPrestamos.length;
}

totalPendientes(): number {
  return this.listPrestamos.filter(p => p.estado?.toLowerCase() === 'pendiente').length;
}

totalPagados(): number {
  return this.listPrestamos.filter(p => p.estado?.toLowerCase() === 'pagado').length;
}

calcularMontoTotal(): number {
  return this.listPrestamos.reduce((acc, prestamo) => acc + Number(prestamo.monto), 0);
}

// ...fin de la seccion de tarjetasd de estadisticas...

// ...existing code...
applyPrestamosFilters() {
  if (this.filtro.trim() === '') {
    this.filteredPrestamos = [...this.listPrestamos];
  } else {
    const searchTerm = this.filtro.toLowerCase();
    this.filteredPrestamos = this.listPrestamos.filter(prestamo =>
      (prestamo.cliente?.nombre?.toLowerCase().includes(searchTerm) || '') ||
      (prestamo.descripcion?.toLowerCase().includes(searchTerm) || '') ||
      (prestamo.estado?.toLowerCase().includes(searchTerm) || '')
    );
  }
  this.currentPage = 1;
  this.updatePrestamosPagination();
}

updatePrestamosPagination() {
  this.totalPages = Math.ceil(this.filteredPrestamos.length / this.itemsPerPage);
  this.updatePaginatedPrestamos();
}

updatePaginatedPrestamos() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedPrestamos = this.filteredPrestamos.slice(startIndex, endIndex);
}

changePrestamosPage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.updatePaginatedPrestamos();
}

previousPrestamosPage() {
  if (this.currentPage > 1) {
    this.changePrestamosPage(this.currentPage - 1);
  }
}

nextPrestamosPage() {
  if (this.currentPage < this.totalPages) {
    this.changePrestamosPage(this.currentPage + 1);
  }
}

getPrestamosPageRange(): number[] {
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

getPrestamosPaginationInfo(): string {
  const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
  const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredPrestamos.length);
  return `Mostrando ${startItem}-${endItem} de ${this.filteredPrestamos.length} préstamos`;
}
// ...existing code...
}
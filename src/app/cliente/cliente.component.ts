import { Component } from '@angular/core';
import { ClienteService } from '../Servicios/cliente.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})

export class ClienteComponent {
  // Propiedades originales
  listCliente: any[] = [];
  modalAbierto: boolean = false;
  modoEdicion: boolean = false;
  clienteSeleccionado: any = {
    id: null,
    nombre: '',
    dni: '',
    telefono: '',
    direccion: '',
    activo: ''
  };

  // Propiedades para paginación y filtrado
  filtro: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  filteredClients: any[] = [];
  paginatedClients: any[] = [];

  constructor(private clienteS: ClienteService) {}

  ngOnInit() {
    this.obtenerClientes();
  }

  // Método para obtener la lista de clientes
  obtenerClientes() {
    this.clienteS.getCliente().subscribe({
      next: (data: any) => {
        this.listCliente = data.clientes;
        this.applyFilters(); // Aplicar filtros y paginación
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }

  // Método para buscar clientes (ahora con filtrado local y backend)
  filtrarCliente() {
    if (this.filtro.trim() === '') {
      this.obtenerClientes(); // Si no hay filtro, obtener todos
      return;
    }

    // Opción 1: Filtrado desde el backend
    this.clienteS.filtrarCliente(this.filtro, this.filtro).subscribe({
      next: (data: any) => {
        this.listCliente = data.clientes;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al filtrar clientes:', error);
        // Fallback: filtrado local si falla el backend
        this.applyFilters();
      }
    });
  }

  // Método para aplicar filtros localmente y configurar paginación
  applyFilters() {
    if (this.filtro.trim() === '') {
      this.filteredClients = [...this.listCliente];
    } else {
      const searchTerm = this.filtro.toLowerCase();
      this.filteredClients = this.listCliente.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm) ||
        cliente.dni.includes(searchTerm) ||
        cliente.telefono.includes(searchTerm)
      );
    }
    
    this.currentPage = 1; // Resetear a la primera página
    this.updatePagination();
  }

  // Método para actualizar la paginación
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
    this.updatePaginatedClients();
  }

  // Método para obtener clientes de la página actual
  updatePaginatedClients() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClients = this.filteredClients.slice(startIndex, endIndex);
  }

  // Método para cambiar de página
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedClients();
  }

  // Método para ir a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  // Método para ir a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  // Método para obtener el rango de páginas a mostrar
  getPageRange(): number[] {
    const range: number[] = [];
    const maxPages = 5; // Mostrar máximo 5 páginas
    
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);
    
    // Ajustar el inicio si estamos cerca del final
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  }

  // Método para obtener información de paginación
  getPaginationInfo(): string {
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredClients.length);
    return `Mostrando ${startItem}-${endItem} de ${this.filteredClients.length} clientes`;
  }

  // Método para abrir el modal (nuevo o edición)
  abrirModal(cliente?: any) {
    if (cliente) {
      this.clienteSeleccionado = { ...cliente };
      this.modoEdicion = true;
    } else {
      this.clienteSeleccionado = {
        id: null,
        nombre: '',
        dni: '',
        telefono: '',
        direccion: '',
        activo: true // Valor por defecto
      };
      this.modoEdicion = false;
    }
    this.modalAbierto = true;
  }

  // Método para guardar (registrar o editar)
  guardarCliente() {
    // Validación
    if (
      !this.clienteSeleccionado.nombre ||
      !this.clienteSeleccionado.dni ||
      !this.clienteSeleccionado.telefono ||
      !this.clienteSeleccionado.direccion ||
      this.clienteSeleccionado.activo === ''
    ) {
      alert("Todos los campos son requeridos.");
      return;
    }

    if (this.modoEdicion) {
      // Modo edición
      this.clienteS.updateCliente(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe({
        next: (data) => {
          console.log("Cliente actualizado con éxito:", data);
          alert("Cliente actualizado con éxito");
          this.obtenerClientes();
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al actualizar cliente:", error);
          alert("Hubo un error al actualizar el cliente.");
        }
      });
    } else {
      // Modo registro
      this.clienteS.storecliente(
        this.clienteSeleccionado.nombre,
        this.clienteSeleccionado.dni,
        this.clienteSeleccionado.telefono,
        this.clienteSeleccionado.direccion,
        this.clienteSeleccionado.activo
      ).subscribe({
        next: (data) => {
          console.log("Cliente registrado con éxito:", data);
          alert("Cliente registrado con éxito");
          this.obtenerClientes();
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al registrar cliente:", error);
          alert("Hubo un error al registrar el cliente.");
        }
      });
    }
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.modalAbierto = false;
    this.clienteSeleccionado = {
      id: null,
      nombre: '',
      dni: '',
      telefono: '',
      direccion: '',
      activo: ''
    };
  }

  // Método para eliminar un cliente
  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clienteS.eliminarCliente(id).subscribe({
        next: (data) => {
          console.log("Cliente eliminado:", data);
          alert('Cliente eliminado con éxito.');
          this.obtenerClientes();
        },
        error: (error) => {
          console.error("Error al eliminar cliente:", error);
          alert('Hubo un error al eliminar el cliente.');
        }
      });
    }
  }

  // Método para manejar el cambio en el filtro
  onFilterChange() {
    if (this.filtro.trim() === '') {
      this.applyFilters();
    }
  }

  // Método para limpiar el filtro
  clearFilter() {
    this.filtro = '';
    this.applyFilters();
  }

  // Método para verificar si hay clientes
  hasClients(): boolean {
    return this.filteredClients.length > 0;
  }

  // Método para obtener el estado del cliente formateado
  getClientStatus(activo: any): string {
    const isActive = activo === true || activo === 'true';
    return isActive ? 'Activo' : 'Inactivo';
  }

  // Método para obtener la clase CSS del estado
  getStatusClass(activo: any): string {
    const isActive = activo === true || activo === 'true';
    return isActive ? 'status-active' : 'status-inactive';
  }
}
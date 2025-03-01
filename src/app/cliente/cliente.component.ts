import { Component } from '@angular/core';
import { ClienteService } from '../Servicios/cliente.service';

import { FormsModule } from '@angular/forms';  // Importación de NgModel
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2347301898.
import { NgIf, NgFor } from '@angular/common';


@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})

export class ClienteComponent {
  listCliente: any[] = [];
  modalAbierto: boolean = false;
  modoEdicion: boolean = false; // Indica si el modal está en modo edición
  clienteSeleccionado: any = {
    id: null,
    nombre: '',
    dni: '',
    telefono: '',
    direccion: '',
    activo: ''
  };

  filtro: string = '';

  constructor(private clienteS: ClienteService) {}

  ngOnInit() {
    this.obtenerClientes(); // Llenar la lista al cargar la página
  }

  // Método para obtener la lista de clientes
  obtenerClientes() {
    this.clienteS.getCliente().subscribe({
      next: (data: any) => {
        this.listCliente = data.clientes;
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }
  
// Método para buscar clientes
filtrarCliente() {
  const dni = this.filtro; // Asume que el filtro es por DNI
  const nombre = this.filtro; // Asume que el filtro es por nombre

  this.clienteS.filtrarCliente(dni, nombre).subscribe({
    next: (data: any) => {
      this.listCliente = data.clientes; // Actualiza la lista de clientes
    },
    error: (error) => {
      console.error('Error al filtrar clientes:', error);
    }
  });
}

  // Método para abrir el modal (nuevo o edición)
  abrirModal(cliente?: any) {
    if (cliente) {
      // Modo edición: Rellenar el formulario con los datos del cliente
      this.clienteSeleccionado = { ...cliente };
      this.modoEdicion = true;
    } else {
      // Modo registro: Limpiar el formulario
      this.clienteSeleccionado = {
        nombre: '',
        dni: '',
        telefono: '',
        direccion: '',
        activo: '',
      };
      this.modoEdicion = false;
    }
    this.modalAbierto = true; // Abrir el modal
  }

  // Método para guardar (registrar o editar)
  guardarCliente() {
    if (
      !this.clienteSeleccionado.nombre ||
      !this.clienteSeleccionado.dni ||
      !this.clienteSeleccionado.telefono ||
      !this.clienteSeleccionado.direccion ||
      !this.clienteSeleccionado.activo 
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
          this.obtenerClientes(); // Refrescar la lista
        },
        error: (error) => {
          console.error("Error al eliminar cliente:", error);
        }
      });
    }
  }
}
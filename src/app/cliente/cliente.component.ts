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

  constructor(private clienteS: ClienteService) {}

  listCliente: any = [] = [];

  clienteSeleccionado: any = {
    id: null,
    nombre: '',
    dni: '',
    telefono: '',
    direccion: '',
    activo: '',
  };
  modalAbierto = false; // Estado del modal

  ngOnInit() {
    this.obtenerClientes(); // Llamar al cargar la página para llenar la tabla
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

   

  // Método para registrar un nuevo cliente
  storecliente(nombre: any, dni: any, telefono: any, direccion: any, activo: any, usuario_id: any) {
    this.clienteS.storecliente(nombre.value, dni.value, telefono.value, direccion.value, activo.value, usuario_id.value).subscribe({
      next: (data) => {
        console.log("Cliente registrado con éxito:", data);
        alert("Cliente registrado con éxito");

        // Limpiar los campos del formulario
        nombre.value = "";
        dni.value = "";
        telefono.value = "";
        direccion.value = "";
        activo.value = "";

        this.obtenerClientes(); // Refrescar la lista de clientes
        // this.cerrarModal(); // Cerrar el modal después de registrar
      },
      error: (error) => {
        console.error("Error al registrar cliente:", error);
        alert("Hubo un error al registrar el cliente.");
        this.obtenerClientes();
      }
    });
  }

  // Método para editar un cliente existente
  
  editarCliente() {
    this.clienteS.updateCliente(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe({
      next: (data) => {
        console.log("Cliente actualizado con éxito:", data);
        alert("Cliente actualizado con éxito");
        this.obtenerClientes(); // Refrescar la lista
        this.cerrarModal(); // Cerrar el modal
      },
      error: (error) => {
        console.error("Error al actualizar cliente:", error);
        alert("Hubo un error al actualizar el cliente.");
      }
    });
  }


  cerrarModal() {
    this.modalAbierto = false;
    this.clienteSeleccionado = {
      id: null,
      nombre: '',
      dni: '',
      telefono: '',
      direccion: '',
      activo: '',
    };
  }

abrirModal(cliente: any) {
  this.clienteSeleccionado = { ...cliente }; // Copia los datos del cliente seleccionado
  this.modalAbierto = true; // Abre el modal
}
  // Método para eliminar un cliente
 
  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clienteS.eliminarCliente(id).subscribe({
        next: (data) => {
          console.log("Cliente eliminado:", data);
          alert('Cliente eliminado con éxito.');
          this.obtenerClientes();  // Volver a obtener los clientes actualizados
        },
        error: (error) => {
          console.error("Error al eliminar cliente:", error);
        }
      });
    }
  }
}

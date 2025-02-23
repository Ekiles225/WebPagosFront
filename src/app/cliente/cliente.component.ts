import { Component } from '@angular/core';
import { ClienteService } from '../Servicios/cliente.service';
import { FormsModule } from '@angular/forms';  // Importación de NgModel
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {

  constructor(private clienteS: ClienteService) {}

  listCliente: any = [] = [];
  // clienteSeleccionado: any = {
  //   nombreCliente: '',
  //   identificacion: '',
  //   telefono: '',
  //   direccion: ''
  // };  // Cliente que se está editando o creando
  // modalAbierto = false; // Estado del modal

  ngOnInit() {
    this.obtenerClientes(); // Llamar al cargar la página para llenar la tabla
  }

  // Método para abrir el formulario en modo de edición o nuevo
  // abrirModal(cliente?: any) {
  //   if (cliente) {
  //     // Si se pasa un cliente, es porque vamos a editarlo
  //     this.clienteSeleccionado = { ...cliente }; // Clonar el objeto cliente para no modificarlo directamente
  //   } else {
  //     // Si no se pasa cliente, es porque es un nuevo cliente
  //     this.clienteSeleccionado = { nombreCliente: '', identificacion: '', telefono: '', direccion: '' };
  //   }
  //   this.modalAbierto = true; // Abrir el modal
  // }

  // // Método para cerrar el modal
  // cerrarModal() {
  //   this.modalAbierto = false;
  //   this.clienteSeleccionado = { nombreCliente: '', identificacion: '', telefono: '', direccion: '' }; // Limpiar el cliente seleccionado
  // }

 

  // Método para registrar un nuevo cliente
  storecliente(nombreCliente: any, identificacion: any, telefono: any, direccion: any) {
    this.clienteS.storecliente(nombreCliente.value, identificacion.value, telefono.value, direccion.value).subscribe({
      next: (data) => {
        console.log("Cliente registrado con éxito:", data);
        alert("Cliente registrado con éxito");

        // Limpiar los campos del formulario
        nombreCliente.value = "";
        identificacion.value = "";
        telefono.value = "";
        direccion.value = "";

        this.obtenerClientes(); // Refrescar la lista de clientes
        // this.cerrarModal(); // Cerrar el modal después de registrar
      },
      error: (error) => {
        // console.error("Error al registrar cliente:", error);
        alert("Hubo un error al registrar el cliente.");
        this.obtenerClientes();
      }
    });
  }

  // Método para editar un cliente existente
  // editarCliente() {
  //   this.clienteS.updateCliente(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe({
  //     next: (data) => {
  //       console.log("Cliente actualizado con éxito:", data);
  //       alert("Cliente actualizado con éxito");

  //       this.obtenerClientes(); // Refrescar la lista de clientes
  //       this.cerrarModal(); // Cerrar el modal después de actualizar
  //     },
  //     error: (error) => {
  //       console.error("Error al actualizar cliente:", error);
  //       alert("Hubo un error al actualizar el cliente.");
  //     }
  //   });
  // }

   // Método para guardar o actualizar el cliente
  //  guardarOActualizarCliente(nombreCliente: any, identificacion: any, telefono: any, direccion: any) {
  //   if (!nombreCliente.value || !identificacion.value || !telefono.value || !direccion.value) {
  //     alert("Por favor, rellena todos los campos.");
  //     return;
  //   }

  //   if (this.clienteSeleccionado.id) {
  //     // Si el cliente seleccionado tiene un ID, actualizamos
  //     this.editarCliente();
  //   } else {
  //     // Si no tiene ID, es un nuevo cliente
  //     this.storecliente(nombreCliente, identificacion, telefono, direccion);
  //   }
  // }

  
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

  // Método para obtener la lista de clientes
  obtenerClientes() {
    this.clienteS.getCliente().subscribe({
      next: (data: any) => {
        this.listCliente = data.Clientes;
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }
}

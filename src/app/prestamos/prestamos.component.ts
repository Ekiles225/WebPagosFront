import { Component } from '@angular/core';
import { PrestamosService } from '../Servicios/prestamos.service';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [],
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.css'
})
export class PrestamosComponent {

  constructor(private prestamosS: PrestamosService) {}

  listPrestamos: any = [] = [];
  lisClientes: any = [];

  ngOnInit() {
    this.obtenerClientes();
    this.obtenerPrestamos();// Llamar al cargar la página para llenar la tabla
  }

  storePrestamos(montoTotal:any, interes:any, montoInteres:any, montoTotalConInteres:any, cuotas:any, fechaInicio:any, fechaFin:any, estado:any, clienteId:any){
    this.prestamosS.storePrestamos(montoTotal, interes, montoInteres, montoTotalConInteres, cuotas, fechaInicio, fechaFin, estado, clienteId).subscribe({
      next: (data) => {
        console.log("Cliente registrado con éxito:", data);
        alert("Cliente registrado con éxito");

        // Limpiar los campos del formulario
        montoTotal.value = "";
        interes.value = ""; 
        montoInteres.value = "";
        montoTotalConInteres.value = "";
        cuotas.value = "";
        fechaInicio.value = "";
        fechaFin.value = "";
        estado.value = "";
        clienteId.value = "";

        this.obtenerPrestamos(); // Refrescar la lista de clientes
        // this.cerrarModal(); // Cerrar el modal después de registrar
      },
      error: (error) => {
        console.error("Error al registrar cliente:", error);
        alert("Hubo un error al registrar el cliente.");
      }
    });
  }

  obtenerPrestamos() {
    this.prestamosS.getPrestamos().subscribe({
      next: (data: any) => {
        this.listPrestamos = data.Prestamos;
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }

  obtenerClientes() {
    this.prestamosS.getCliente().subscribe({
      next: (data: any) => {
        this.lisClientes = data.Clientes;
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }

  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este prestamos?')) {
      this.prestamosS.eliminarPrestamos(id).subscribe({
        next: (data) => {
          console.log("Cliente eliminado:", data);
          alert('Cliente eliminado con éxito.');
          this.obtenerPrestamos();  // Volver a obtener los clientes actualizados
        },
        error: (error) => {
          console.error("Error al eliminar cliente:", error);
        }
      });
    }
  }

}

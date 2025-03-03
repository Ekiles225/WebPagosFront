import { Component } from '@angular/core';
import { PrestamosService } from '../Servicios/prestamos.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent {
  listPrestamos: any[] = [];
  lisClientes: any[] = [];
  modalAbierto: boolean = false;
  modoEdicion: boolean = false;
  prestamoSeleccionado: any = {
    id: null,
    monto: null,
    tasa_interes: null,
    total_a_pagar: null,
    fecha_inicio: '',
    fecha_vencimiento: '',
    estado: '',
    descripcion: '',
    cliente_id: null,
  };

  constructor(private prestamosS: PrestamosService) {}

  ngOnInit() {
    this.obtenerClientes();
    this.obtenerPrestamos();
  }


  abrirModal(prestamo?: any) {
    if (prestamo) {
      this.prestamoSeleccionado = { ...prestamo };
      this.modoEdicion = true;
    } else {
      this.prestamoSeleccionado = {
        id: null,
        monto: null,
        tasa_interes: null,
        total_a_pagar: null,
        fecha_inicio: '',
        fecha_vencimiento: '',
        estado: '',
        descripcion: '',
        cliente_id: null,
        total_pagar: null
      };
      this.modoEdicion = false;
    }
    this.modalAbierto = true;
  }

  guardarPrestamo() {

    if (this.modoEdicion) {
      this.prestamosS.updatePrestamos(this.prestamoSeleccionado.id, this.prestamoSeleccionado).subscribe({
        next: (data:any) => {
          console.log("Préstamo actualizado con éxito:", data);
          alert("Préstamo actualizado con éxito");
          this.obtenerPrestamos();
          this.cerrarModal();
        },
        error: (error:any) => {
          console.error("Error al actualizar préstamo:", error);
          alert("Hubo un error al actualizar el préstamo.");
        }
      });
    } else {
      this.prestamosS.storePrestamos(
        this.prestamoSeleccionado.monto,
        this.prestamoSeleccionado.tasa_interes,
        this.prestamoSeleccionado.fecha_inicio,
        this.prestamoSeleccionado.fecha_vencimiento,
        this.prestamoSeleccionado.estado,
        this.prestamoSeleccionado.descripcion,
        this.prestamoSeleccionado.cliente_id
      ).subscribe({
        next: (data) => {
          console.log("Préstamo registrado con éxito:", data);
          alert("Préstamo registrado con éxito");
          this.obtenerPrestamos();
          this.cerrarModal();
        },
        error: (error) => {
          console.error("Error al registrar préstamo:", error);
          alert("Hubo un error al registrar el préstamo.");
        }
      });
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  obtenerPrestamos() {
    this.prestamosS.getPrestamosYClientes().subscribe({
      next: (data: any) => {
        this.listPrestamos = data.prestamos;
      },
      error: (error) => {
        console.error('Error al obtener préstamos:', error);
      }
    });
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
}
import { Component } from '@angular/core';
import { DasbhoarService } from '../Servicios/dasbhoar.service';
import { RouterLink } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { DecimalPipe } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, RouterLink, CanvasJSAngularChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent  {

  // Propiedades para almacenar los datos
  listCliente: any[] = [];
  listPrestamos: any[] = [];
  listPagos: any[] = [];

  // Resumen del dashboard
  totalClientes: number = 0;
  prestamosPendientes: number = 0;
  pagosRealizados: number = 0;

  //sobre los graficos 
  prestamosPorMes: { [key: string]: number } = {};
  gananciasPorMes: { [key: string]: number } = {};

  chartOptions: any = {}; // ✅ Inicializar vacío


  constructor(private dasbhoar: DasbhoarService) {}




  ngOnInit() {
    this.obtenerClientes();
    this.obtenerPrestamos();
    this.obtenerPagos();
  }

  obtenerClientes() {
    this.dasbhoar.getClientess().subscribe({
      next: (data: any) => {
        this.listCliente = data.clientes.slice(0, 3); // Limitar a 3 clientes
        this.totalClientes = data.clientes.length; // Actualizar el total de clientes
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }

  obtenerPrestamos() {
    this.dasbhoar.getPrestamos().subscribe({
      next: (data: any) => {
        this.listPrestamos = data.prestamos;
        this.prestamosPendientes = data.prestamos.filter((prestamo: any) => prestamo.estado === 'pendiente').length;
        this.procesarDatos();
      },
      error: (error) => {
        console.error('Error al obtener préstamos:', error);
      }
    });
  }

  procesarDatos() {
    this.prestamosPorMes = {};
    this.gananciasPorMes = {};

    this.listPrestamos.forEach(prestamo => {
      const fecha = new Date(prestamo.fecha_inicio);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`; // Formato YYYY-MM

      // Contar número de préstamos por mes
      this.prestamosPorMes[mes] = (this.prestamosPorMes[mes] || 0) + 1;

      // Sumar ganancias por mes
      this.gananciasPorMes[mes] = (this.gananciasPorMes[mes] || 0) + parseFloat(prestamo.total_a_pagar);
    });

    this.actualizarGrafico();
  }

  actualizarGrafico() {
    const dataPointsPrestamos: any[] = [];
    const dataPointsGanancias: any[] = [];
    const meses = Object.keys(this.prestamosPorMes).sort(); // Ordenar por fecha

    meses.forEach(mes => {
      dataPointsPrestamos.push({ label: mes, y: this.prestamosPorMes[mes] });
      dataPointsGanancias.push({ label: mes, y: this.gananciasPorMes[mes] });
    });

    this.chartOptions = {
      animationEnabled: true,
      title: { text: "Estadística de Préstamos y Ganancias" },
      axisX: { title: "Meses" },
      axisY: { title: "Cantidad / Ganancia ($)", suffix: " $" },
      data: [
        {
          type: "splineArea",
          name: "Cantidad de Préstamos",
          showInLegend: true,
          color: "rgba(54,158,173,.7)",
          dataPoints: dataPointsPrestamos
        },
        {
          type: "splineArea",
          name: "Ganancia Total",
          showInLegend: true,
          color: "rgba(255,99,132,0.7)",
          dataPoints: dataPointsGanancias
        }
      ]
    };
  }

  obtenerPagos() {
    this.dasbhoar.getPagos().subscribe({
      next: (data: any) => {
        this.listPagos = data.pagos;
        this.pagosRealizados = data.pagos.length; // Actualizar el total de pagos realizados
      },
      error: (error) => {
        console.error('Error al obtener pagos:', error);
      }
    });
  }

  // ...existing code...


// Si quieres que "Ingresos" sea la suma de todos los pagos realizados:
get totalIngresos(): number {
  return this.listPagos?.reduce((acc, pago) => acc + Number(pago.monto_pagado || 0), 0) || 0;
}

// Si quieres que "Crecimiento" y "Recuperación" sean calculados, agrega lógica según tu necesidad
get crecimiento(): string {
  // Ejemplo: crecimiento ficticio
  return '+15.3%';
}

get recuperacion(): string {
  // Ejemplo: recuperación ficticia
  return '94.2%';
}

// ...existing code...
}
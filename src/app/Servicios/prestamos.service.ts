import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  constructor(private http: HttpClient) { }

  storePrestamos(montoTotal:any, interes:any, montoInteres:any, montoTotalConInteres:any, cuotas:any, fechaInicio:any, fechaFin:any, estado:any, clienteId:any){
    const parametros = {
      montoTotal: montoTotal,
      interes: interes,
      montoInteres: montoInteres,
      montoTotalConInteres: montoTotalConInteres,
      cuotas: cuotas,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estado: estado,
      clienteId: clienteId
    }
    return this.http.post('http://127.0.0.1:8000/api/prestamos', parametros); 
  }

  getPrestamos(){
    return this.http.get('http://127.0.0.1:8000/api/prestamos');
  }

  getCliente(){
    return  this.http.get("http://127.0.0.1:8000/api/clientes");
   }

  eliminarPrestamos(id: number) {
    return this.http.delete(`http://127.0.0.1:8000/api/prestamos/${id}`);
  }

  updatePrestamos(id: number, prestamosData: any) {
    return this.http.put(`http://127.0.0.1:8000/api/prestamos/${id}`, prestamosData);  
  }

}

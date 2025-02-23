import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(private http: HttpClient) { }


  // storePagos(nombreCliente:any, identificacion:any, telefono:any, direccion:any){
  //   const parametros = {
  //     nombreCliente: nombreCliente,
  //     identificacion: identificacion,
  //     telefono: telefono,
  //     direccion: direccion
  //   }

  //   return this.http.post("http://127.0.0.1:8000/api/pagos", parametros);
  // }

  // getCliente(){
  //   return  this.http.get("http://127.0.0.1:8000/api/clientes");
  //  }

  //  eliminarCliente(id: number) {
  //   return this.http.delete(`http://127.0.0.1:8000/api/clientes/${id}`);
  // }

  // updateCliente(id: number, clienteData: any) {
  //   return this.http.put(`http://127.0.0.1:8000/api/clientes/${id}`, clienteData);  // Petición PUT para editar el cliente
  // }

}

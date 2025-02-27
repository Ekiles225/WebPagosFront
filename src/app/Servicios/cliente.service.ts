import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  storecliente(nombre:string, dni:string, telefono:string, direccion:Text, activo:boolean, usuario_id:any){
    const parametros = {
     nombre: nombre,
     dni: dni,
     telefono: telefono,
     direccion: direccion,
     activo: activo,
     usuario_id: usuario_id
    }

    return this.http.post("http://127.0.0.1:3000/api/cliente", parametros);
  }

  getCliente(){
    return  this.http.get("http://127.0.0.1:3000/api/cliente");
   }

   getClienteById(id: number) {
    return this.http.get(`http://127.0.0.1:3000/api/cliente/${id}`);
  }

   eliminarCliente(id: number) {
    return this.http.delete(`http://127.0.0.1:3000/api/cliente/${id}`);
  }

  updateCliente(id: number, clienteData: any) {
    return this.http.put(`http://127.0.0.1:3000/api/cliente/${id}`, clienteData);  // Petición PUT para editar el cliente
  }
}

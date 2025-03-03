import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  constructor(private http: HttpClient) { }

  storePrestamos(monto:any, tasa_interes:any, fecha_inicio:any, fecha_vencimiento:any, estado:any, descripcion:any, cliente_id:any){
    const parametros = {
      monto: monto,
      tasa_interes: tasa_interes,
      fecha_inicio: fecha_inicio,
      fecha_vencimiento: fecha_vencimiento,
      estado: estado,
      descripcion: descripcion,
      cliente_id: cliente_id
    }
    return this.http.post('http://127.0.0.1:3000/api/prestamo', parametros); 
  }


  
  getPrestamosYClientes(){
    return this.http.get('http://localhost:3000/api/prestamos');
  }

  getCliente(){
    return  this.http.get("http://127.0.0.1:3000/api/cliente");
   }

  eliminarPrestamos(id: number) {
    return this.http.delete(`http://127.0.0.1:3000/api/prestamo/${id}`);
  }

  updatePrestamos(id: number, prestamosData: any) {
    return this.http.put(`http://127.0.0.1:3000/api/prestamo/${id}`, prestamosData);  
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(private http: HttpClient) { }


  storePagos(prestamo_id:any, monto_pagado:any, fecha_pago:any, saldo_restante:any){
    const parametros = {
      prestamo_id: prestamo_id,
      monto_pagado: monto_pagado,
      fecha_pago: fecha_pago,
      saldo_restante: saldo_restante
    }

    return this.http.post("http://localhost:3000/api/pago", parametros);
  }

  getPagos(){
    return this.http.get('http://localhost:3000/api/pagos');
  }

   eliminarPagos(id: number) {
    return this.http.delete(`http://localhost:3000/api/pago/${id}`);
  }

  updatePagos(id: number, clienteData: any) {
    return this.http.put(`http://localhost:3000/api/pago/${id}`, clienteData);  // Petición PUT para editar el cliente
  }

}

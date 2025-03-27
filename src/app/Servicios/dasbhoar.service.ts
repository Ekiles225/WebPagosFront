import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DasbhoarService {

  constructor(private http: HttpClient) { }

  getClientess(){
    return  this.http.get("http://localhost:3000/api/cliente");
   }

   getPagos(){
    return  this.http.get("http://localhost:3000/api/pago");
   }

   getPrestamos(){
    return  this.http.get("http://localhost:3000/api/prestamo");
   }

}

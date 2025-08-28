import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Prestamo {
  id?: string; // Optional for new loans, required for existing ones
  cliente_id: string;
  monto: number;
  tasa_interes: number;
  fecha_inicio: string; // Consider using Date objects or specific date strings
  fecha_vencimiento: string; // Consider using Date objects or specific date strings
  estado: string;
  descripcion?: string; // Optional field
  total_a_pagar?: number; // This will be calculated on the backend
}

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  constructor(private http: HttpClient) { }
private apiUrl = 'http://127.0.0.1:3000/api/prestamo'; 
  
 

 storePrestamos(prestamoData: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, prestamoData);
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

  updatePrestamo(id: string, prestamoData: Prestamo): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}`, prestamoData);
  }

}

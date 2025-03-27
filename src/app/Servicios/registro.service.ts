import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private http: HttpClient) { }

  storeRegistro(nombreYapellido:any, passware:any, rol:any, telefono:any, activo:any, person_id:any){
    const parametros = {
      nombreYapellido: nombreYapellido,
      passware: passware,
      rol: rol,
      telefono: telefono,
      activo: activo,
      person_id: person_id
    }
    return this.http.post('http://localhost:3000/api/register', parametros); 
  }

  
}

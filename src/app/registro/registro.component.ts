import { Component } from '@angular/core';
import { RegistroService } from '../Servicios/registro.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  
  constructor(private RegistroService: RegistroService, private router: Router) {}

  ngOnInit() {
   
  }

  //metodo que consume el metodo del servicio para registrar
  registerUser(nombreYapellido:any, passware:any, rol:any, telefono:any, activo:any, person_id:any){
    this.RegistroService.storeRegistro(nombreYapellido.value, passware.value, rol.value, telefono.value, activo.value, person_id.value).subscribe({
        next: (datos:any) =>{   
          
          this.router.navigateByUrl('/login');
        }, 
        error:(error:any) =>{
          console.log('Error al registrar usuario', error.message);
        

        }
    });
  }

}

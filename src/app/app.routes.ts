import { Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { PagosComponent } from './pagos/pagos.component';
import { HistorialDePagosComponent } from './historial-de-pagos/historial-de-pagos.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [

    { path: '', component:DashboardComponent },

    { path: 'clientes', component: ClienteComponent},

    {path: 'prestamos', component: PrestamosComponent},

    {path: 'pagos', component: PagosComponent},

    {path: 'historialPagos', component: HistorialDePagosComponent},

    { path: '**', redirectTo: '' }
];

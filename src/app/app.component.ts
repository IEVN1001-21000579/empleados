import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import AppEmpleadosComponent from './empleados/empleados.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppEmpleadosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'empleados';
}

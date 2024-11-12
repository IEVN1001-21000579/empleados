import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Interface para los datos base del empleado (lo que se guardará)
interface EmpleadoBase {
  matricula: string;
  nombre: string;
  correo: string;
  edad: number;
  horasTrabajadas: number;
}

// Interface completa del empleado (incluyendo campos calculados)
interface Empleado extends EmpleadoBase {
  horasPorPagar: number;
  horasExtras: number;
  subtotal: number;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empleados.component.html',
  //styleUrl: './empleados.component.css'
})
export default class EmpleadosComponent implements OnInit {
  formGroup: FormGroup;
  empleados: Empleado[] = [];
  totalAPagar: number = 0;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      matricula: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18)]],
      horasTrabajadas: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadEmpleados();
  }

  calcularCamposEmpleado(empleadoBase: EmpleadoBase): Empleado {
    const horasPorPagar = Math.min(empleadoBase.horasTrabajadas, 40) * 70;
    const horasExtras = Math.max(empleadoBase.horasTrabajadas - 40, 0) * 140;
    const subtotal = horasPorPagar + horasExtras;

    return {
      ...empleadoBase,
      horasPorPagar,
      horasExtras,
      subtotal
    };
  }

  onSubmit() {
      const empleadoBase: EmpleadoBase = this.formGroup.value;
      const empleadoCompleto = this.calcularCamposEmpleado(empleadoBase);
      
      this.empleados.push(empleadoCompleto);
      this.saveEmpleados();
      this.formGroup.reset();

  }

  modificarEmpleado() {
    const matriculaModificar = (document.getElementById('matricula_modificar') as HTMLInputElement).value;
    const index = this.empleados.findIndex(e => e.matricula === matriculaModificar);
    if (index !== -1) {
      this.formGroup.patchValue(this.empleados[index]);
      this.empleados.splice(index, 1);
      this.saveEmpleados();
    } else {
      alert('Empleado no encontrado');
    }
  }

  eliminarEmpleado() {
    const matriculaEliminar = (document.getElementById('matricula_modificar') as HTMLInputElement).value;
    const index = this.empleados.findIndex(e => e.matricula === matriculaEliminar);
    if (index !== -1) {
      this.empleados.splice(index, 1);
      this.saveEmpleados();
    } else {
      alert('Empleado no encontrado');
    }
  }

  generarTabla() {
    this.calcularTotalAPagar();
  }

  imprimirTabla() {
    window.print();
  }

  private saveEmpleados() {
    // Solo guardamos los datos base de cada empleado
    const empleadosBase: EmpleadoBase[] = this.empleados.map(({ matricula, nombre, correo, edad, horasTrabajadas }) => ({
      matricula,
      nombre,
      correo,
      edad,
      horasTrabajadas
    }));
    localStorage.setItem('empleados', JSON.stringify(empleadosBase));
  }

  private loadEmpleados() {
    const storedEmpleados = localStorage.getItem('empleados');
    if (storedEmpleados) {
      // Convertimos los datos base almacenados en empleados completos
      const empleadosBase: EmpleadoBase[] = JSON.parse(storedEmpleados);
      this.empleados = empleadosBase.map(empleadoBase => this.calcularCamposEmpleado(empleadoBase));
      this.calcularTotalAPagar();
    }
  }

  private calcularTotalAPagar() {
    this.totalAPagar = this.empleados.reduce((total, empleado) => total + empleado.subtotal, 0);
  }
}
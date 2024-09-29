import { Component } from '@angular/core';
import { REACTIVE_NODE } from '@angular/core/primitives/signals';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  
  signUpForm = this.fb.group({
    email: [''],
    username: ['',[Validators.required]],
    password: ['',[Validators.required]],
    retypepassword: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder, private router: Router) { }

  validateUsername(username: string) {

    // Verificar longitud
    if (username.length < 8 || username.length > 15) {
      alert('El nombre de usuario debe contener entre 8 y 15 caracteres');
      return false;
    }

    // Verificar espacios
    if (/\s/.test(username)) {
      alert('El nombre de usuario no debe contener espacios');
      return false;
    }

    // Verificar que no inicie con un número o carácter especial
    const firstChar = username![0];
    if (/\d/.test(firstChar) || /[\W_]/.test(firstChar)) {
      alert('El nombre de usuario no debe iniciar con numero o caracter especial');
      return false;
    }

    return true;
  }


  // Función para validar la contraseña
  validatePassword(password:string) {


    // Verificar longitud
    if (password.length < 12 || password.length > 20) {
      alert('La contraseña de usuario debe contener entre 12 y 20 caracteres');
      return false;
    }

    // Verificar letra en mayúscula
    if (!/[A-Z]/.test(password)) {
      alert('La contraseña de usuario debe contener almenos una letra mayuscula');
      return false;
    }

    // Verificar letra en minúscula
    if (!/[a-z]/.test(password)) {
      alert('La contraseña de usuario debe contener almenos una letra minuscula');
      return false;
    }

    // Verificar un número
    if (!/\d/.test(password)) {
      alert('La contraseña de usuario debe contener almenos un numero');
      return false;
    }

    // Verificar un carácter especial
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
      alert('La contraseña de usuario debe contener almenos un caracter especial');
      return false;
    }
    // Verificar espacios
    if (/\s/.test(password)) {
      alert('La contraseña de usuario no debe contener espacios');
      return false;
    }

    return true;
  }

  onRegistry() {

    console.log(this.signUpForm.value)
    if (!this.signUpForm.valid) {
      alert('Diligencie el formulario')
      return;
    }
    
    
    let username = this.signUpForm.value.username;
    let password = this.signUpForm.value.password;
    let retypepassword = this.signUpForm.value.retypepassword;



    if (!this.validateUsername(username!)) {
      
    } else if (!this.validatePassword(password!)) {
      return;
    } else if (retypepassword! !== password!) {
      alert("Las contraseñas no coinciden")

    } else {
      localStorage.setItem(username!, password!);
      this.router.navigateByUrl('/home')
      alert("Usuario registrado con exito")
    }
  }

}

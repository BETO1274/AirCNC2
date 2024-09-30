import { Component } from '@angular/core';
import { REACTIVE_NODE } from '@angular/core/primitives/signals';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { log } from 'console';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent {

  signUpForm = this.fb.group({
    email: ['',[Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    retypepassword: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder, private router: Router, private auth:AuthService) { }

  validateUsername(username: string) {

    // Verificar longitud
    if (username.length < 8 || username.length > 15) {
    
Swal.fire({
  text: 'El nombre de usuario debe contener entre 8 y 15 caracteres',
  icon: 'info'
});
      return false;
    }

    // Verificar espacios
    if (/\s/.test(username)) {
      Swal.fire({
        text: 'El nombre de usuario no debe contener espacios',
        icon: 'info'
      });

      return false;
    }

    // Verificar que no inicie con un número o carácter especial
    const firstChar = username![0];
    if (/\d/.test(firstChar) || /[\W_]/.test(firstChar)) {
      Swal.fire({
        text: 'El nombre de usuario no debe iniciar con numero o caracter especial',
        icon: 'info'
      });
 
      return false;
    }

    return true;
  }


  // Función para validar la contraseña
  validatePassword(password: string) {


    // Verificar longitud
    if (password.length < 12 || password.length > 20) {

      Swal.fire({
        text: 'La contraseña de usuario debe contener entre 12 y 20 caracteres',
        icon: 'info'
      });
      return false;
    }

    // Verificar letra en mayúscula
    if (!/[A-Z]/.test(password)) {
      Swal.fire({
        text: 'La contraseña de usuario debe contener almenos una letra mayuscula',
        icon: 'info'
      });
    
      return false;
    }

    // Verificar letra en minúscula
    if (!/[a-z]/.test(password)) {

      Swal.fire({
        text: 'La contraseña de usuario debe contener almenos una letra minuscula',
        icon: 'info'
      });
      return false;
    }

    // Verificar un número
    if (!/\d/.test(password)) {
      Swal.fire({
        text: 'La contraseña de usuario debe contener almenos un numero',
        icon: 'info'
      });
      return false;
    }

    // Verificar un carácter especial
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
      Swal.fire({
        text: 'La contraseña de usuario debe contener almenos un caracter especial',
        icon: 'info'
      });
      return false;
    }
    // Verificar espacios
    if (/\s/.test(password)) {
      Swal.fire({
        text: 'La contraseña de usuario no debe contener espacios',
        icon: 'info'
      });
     
      return false;
    }

    return true;
  }



  onRegistry() {
   
    console.log(this.signUpForm.value)
    if (!this.signUpForm.valid) {
      Swal.fire({
        text: 'Diligencie el formulario',
        icon: 'warning'
      });
  
      return;
    }

const newUser:User={
    username : this.signUpForm.value.username ?? '',
    password : this.signUpForm.value.password ?? '',  
    email: this.signUpForm.value.email ?? '',
    estates:[],
 }
    let retypepassword = this.signUpForm.value.retypepassword


    if (!this.validateUsername(newUser.username)) {

    } else if (!this.validatePassword(newUser.password)) {
      return;
    } else if (retypepassword! !== newUser.password) {
        Swal.fire("Las contraseñas no coinciden")
      return;
    } else {

      localStorage.setItem(newUser.username, JSON.stringify(newUser));
      this.auth.login(newUser.username)
      this.router.navigateByUrl('/home')
       Swal.fire("Usuario registrado con exito")
    }
  }


}

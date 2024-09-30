import { Component } from '@angular/core';
import { REACTIVE_NODE } from '@angular/core/primitives/signals';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private fb: FormBuilder, private router: Router, private auth:AuthService) {}

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.pattern('')]],
    password: ['', [Validators.required]]
  })

  onlogin() {

    const user : User={
       username: this.loginForm.value.username|| '',
       password: this.loginForm.value.password || '',

    } 
    
    let storedPassword = localStorage.getItem(user.username);



    if (!this.loginForm.valid) {
      alert('Diligencie el formulario');
      return;
    }
    if (storedPassword) {
      // Convertir la cadena JSON en un objeto
      const userSt = JSON.parse(storedPassword);
      
    
    if (user.password !== userSt.password) {
      alert('Verifique nombre de usuario o contraseña');
      this.loginForm.reset()
      return;
    }

    this.auth.login(user.username)
    this.router.navigateByUrl('/home')
  }
 }
}

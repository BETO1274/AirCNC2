import { Component } from '@angular/core';
import { REACTIVE_NODE } from '@angular/core/primitives/signals';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.pattern('')]],
    password: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder, private router: Router) {

  }

  onlogin() {
    if (!this.loginForm.valid) {
      alert('Diligencie el formulario')
      return;
    }

    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;
    let storedPassword = localStorage.getItem(username!.toLowerCase());

    if (password !== storedPassword) {
      alert('Verifique nombre de usuario o contraseña');
      return;
    }
    this.router.navigateByUrl('/home')
  }
}

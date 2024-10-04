import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onlogin() {
    if (this.loginForm.invalid) {
      Swal.fire('Error', 'Diligencie el formulario correctamente.', 'error');
      return;
    }

    const user: User = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    const storedPassword = localStorage.getItem(user.username);

    if (!storedPassword) {
      Swal.fire('Error', 'Verifique nombre de usuario o contraseña', 'error');
      return;
    }

    const userSt = JSON.parse(storedPassword);

    if (user.password !== userSt.password) {
      Swal.fire('Error', 'Verifique nombre de usuario o contraseña', 'error');
      return;
    }

    this.auth.login(user.username); // Guarda el usuario en AuthService
    this.router.navigateByUrl('/home');
    Swal.fire('Éxito', 'Has iniciado sesión correctamente.', 'success');
  }
}
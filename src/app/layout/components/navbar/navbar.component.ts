import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink], // Asegúrate de incluir CommonModule
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Cambié 'styleUrl' a 'styleUrls'
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isUserActive: boolean = false;
  menuActive: boolean = false;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.checkUserActive();
  }

  toggleMenu() {
    this.menuActive = !this.menuActive; // Cambia el estado del menú
}

  checkUserActive() {
    const currentUser = this.auth.getCurrentUser();
    this.isUserActive = currentUser !== null; // Establecer verdadero si hay un usuario activo
  }

  logout() {
    this.checkUserActive();
    if (this.isUserActive) {
      this.auth.logout(); // Llama al método de cerrar sesión
      this.router.navigateByUrl('/home'); // Redirige a la página de inicio
      Swal.fire('¡Cerrado!', 'Has cerrado sesión correctamente.', 'success');
      this.isUserActive=false
    }
  }
}

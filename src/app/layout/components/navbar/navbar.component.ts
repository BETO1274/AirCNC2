import { Component, OnInit } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../../interfaces/user.interface';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isUserActive: boolean = false;
  
  ngOnInit() {
    this.checkUserActive();
  }
  
  constructor(private router:Router, private auth:AuthService){}

  checkUserActive() {
    const currentUser = this.auth.getCurrentUser();
    this.isUserActive = currentUser !== null; // Establecer verdadero si hay un usuario activo
  }

   togglebtn() {
    let navBar = document.getElementById("navBar");
      navBar!.classList.toggle("hidemenu")
    }

    logout(){
      this.checkUserActive();
      if(this.isUserActive){
      this.auth.logout(); // Llama al método de cerrar sesión
      this.router.navigateByUrl('/home') // Redirige a la página de inicio de sesión
      Swal.fire('¡Cerrado!', 'Has cerrado sesión correctamente.', 'success');
      }

    }
   }




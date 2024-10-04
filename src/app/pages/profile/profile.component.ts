import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private auth: AuthService, private supabase:SupabaseService) { }
  currentUser: User | null = null;
  isUserActive: boolean = false; 

  ngOnInit() {
    this.loadUserProfile();
  }
  
  loadUserProfile() {
    this.currentUser = this.auth.getCurrentUser();
    this.isUserActive = this.currentUser !== null; // Establecer verdadero si hay un usuario activo
  }

  async openUpdateProfileModal() {
    const { value: formValues } = await Swal.fire({
      title: 'Actualizar Perfil',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <label for="email">Email:</label>
          <input id="email" class="swal2-input" placeholder="Email" value="${this.currentUser?.email || ''}">
          
          <label for="username">Nombre de usuario:</label>
          <input id="username" class="swal2-input" placeholder="Nombre de usuario" value="${this.currentUser?.username || ''}">
          
          <label for="biography">Biografía:</label>
          <textarea id="biography" class="swal2-textarea" placeholder="Biografía">${this.currentUser?.biography || ''}</textarea>
          
          <label for="phoneNumber">Número de teléfono:</label>
          <input id="phoneNumber" class="swal2-input" placeholder="Número de teléfono" value="${this.currentUser?.phoneNumber || ''}">
          
          <label for="preferences">Preferencias de viaje:</label>
          <input id="preferences" class="swal2-input" placeholder="Preferencias de viaje" value="${this.currentUser?.preferences || ''}">
          
          <label for="verified">Verificado:</label>
          <select id="verified" class="swal2-select">
            <option value="true" ${this.currentUser?.verified ? 'selected' : ''}>Sí</option>
            <option value="false" ${!this.currentUser?.verified ? 'selected' : ''}>No</option>
          </select>
  
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          username: (document.getElementById('username') as HTMLInputElement).value,
          biography: (document.getElementById('biography') as HTMLTextAreaElement).value,
          email: (document.getElementById('email') as HTMLInputElement).value,
          phoneNumber: (document.getElementById('phoneNumber') as HTMLInputElement).value,
          preferences: (document.getElementById('preferences') as HTMLInputElement).value,
          verified: (document.getElementById('verified') as HTMLSelectElement).value === 'true',
          
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    });
  
    if (formValues) {
      const oldUsername = this.currentUser?.username;
  
      // Crear un nuevo objeto de usuario
      const updatedUser: User = {
        ...this.currentUser!,
        username: formValues.username,
        biography: formValues.biography,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
        preferences: formValues.preferences,
        verified: formValues.verified,
      };
  
      // Si el username ha cambiado
      if (formValues.username !== oldUsername) {
        // Eliminar el usuario antiguo de localStorage
        localStorage.removeItem(oldUsername!); // Eliminar con el antiguo username
      }
  
      // Guardar el usuario actualizado en localStorage
      localStorage.setItem(updatedUser.username, JSON.stringify(updatedUser));
  
      // Actualizar el usuario en el servicio
      this.auth.updateUser(this.currentUser, updatedUser);
  
      Swal.fire('¡Éxito!', 'Perfil actualizado con éxito.', 'success');
    }
  }
  

  onUpload(event:Event){
    let inputFile = event.target as HTMLInputElement;
    if(!inputFile.files || inputFile.files.length <= 0){
      return;
    }
    const file:File = inputFile.files[0];
    const fileName = uuidv4();
    const folderName = this.currentUser!.username+'/profile';
    
    this.supabase.upload(file, fileName, folderName);
    const updatedUser:User = {
      ...this.currentUser!,
      profilePicture: 'https://ffenhqwkmshxesotaasr.supabase.co/storage/v1/object/public/AirCNC/'+folderName+'/'+fileName,
    }; 
    this.auth.updateUser(this.currentUser,updatedUser)
    this.ngOnInit()

  }

  
} 
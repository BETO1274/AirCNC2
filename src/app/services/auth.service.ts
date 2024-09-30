import { Injectable } from '@angular/core';
import { Estates, User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor() {}

  login(username: string): void {
    const user = localStorage.getItem(username);
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  updateUser(currentUser: User | null,  updatedUser: User): void {
    if (this.currentUser) {
      // Actualizar el usuario actual
      this.currentUser.username = updatedUser.username;
      this.currentUser.profilePicture = updatedUser.profilePicture;
      this.currentUser.biography = updatedUser.biography;
      this.currentUser.email = updatedUser.email;

      // Guardar el usuario actualizado en localStorage
      localStorage.setItem(this.currentUser.username, JSON.stringify(this.currentUser));
    }
  }
  logout(): void {
    this.currentUser = null;
  }

  addEstate(newEstate:Estates): void {
    if (this.currentUser) {
      // Asegúrate de inicializar el arreglo si está vacío
      if (!this.currentUser.estates) {
        this.currentUser.estates = [];
      }
     console.log(newEstate)
     console.log(this.currentUser)
     this.currentUser.estates.push(newEstate)
      localStorage.setItem(this.currentUser.username, JSON.stringify(this.currentUser));
    } else {
      console.error('No hay un usuario conectado.');
    }
    }
    updateEstate(updatedEstate: Estates): void {
      if (this.currentUser) {
        const index = this.currentUser.estates!.findIndex(estate => estate.id === updatedEstate.id);
        
        if (index !== -1) {
          // Actualiza la propiedad en el arreglo
          this.currentUser.estates![index] = updatedEstate;
          localStorage.setItem(this.currentUser.username, JSON.stringify(this.currentUser));
        } else {
          console.error('Propiedad no encontrada');
        }
      } else {
        console.error('No hay un usuario conectado.');
      }
    }

    removeEstate(estateId: number): void {
      if (this.currentUser) {
        const index = this.currentUser.estates!.findIndex(estate => estate.id === estateId);
        if (index !== -1) {
          // Eliminar la propiedad del arreglo
          this.currentUser.estates!.splice(index, 1);
          localStorage.setItem(this.currentUser.username, JSON.stringify(this.currentUser));
          console.log('Propiedad eliminada con éxito.');
        } else {
          console.error('Propiedad no encontrada para eliminar.');
        }
      } else {
        console.error('No hay un usuario conectado.');
      }
    }
  }


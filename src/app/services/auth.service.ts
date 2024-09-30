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
  }


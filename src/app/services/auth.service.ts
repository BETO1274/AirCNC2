import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

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
}

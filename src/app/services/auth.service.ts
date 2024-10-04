import { Injectable } from '@angular/core';
import { Estates, User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private estate: Estates | null=null;

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

  logout(): void {
    this.currentUser = null;
  }


  updateUser(currentUser: User | null,  updatedUser: User): void {
    if (this.currentUser) {
      // Actualizar el usuario actual
      this.currentUser.username = updatedUser.username;
      this.currentUser.profilePicture = updatedUser.profilePicture;
      this.currentUser.biography = updatedUser.biography;
      this.currentUser.email = updatedUser.email;
      this.currentUser.phoneNumber=updatedUser.phoneNumber;
      this.currentUser.preferences=updatedUser.preferences;
      this.currentUser.verified=updatedUser.verified;
      

      // Guardar el usuario actualizado en localStorage
      localStorage.setItem(this.currentUser.username, JSON.stringify(this.currentUser));
    }
  }
 

}
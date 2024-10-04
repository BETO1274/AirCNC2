// estates.service.ts
import { Injectable } from '@angular/core';
import { Estates } from '../interfaces/user.interface'; // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class EstatesService {
  private estates: Estates[] = []; // Define la propiedad estates
  getAllEstates(): Estates[] {
    return this.loadEstatesFromLocalStorage();
  }

  private loadEstatesFromLocalStorage(): Estates[] {
    const storedEstates = Object.keys(localStorage)
      .map(key => {
        const item = localStorage.getItem(key);
        return item ? this.parseItem(item) : null;
      })
      .filter(item => item !== null && item.id !== undefined) as Estates[];
    
    return storedEstates;
  }

  private parseItem(item: string | null): Estates | null {
    try {
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error parsing item:', error);
      return null;
    }
  }
  getEstatesByUser(username: string) {
    return this.estates.filter(estate => estate.username === username);
  }

}

 

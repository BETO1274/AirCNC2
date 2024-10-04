import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  standalone: true,
 imports:[CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  estates: any[] = [];
  currentUser = { username: 'usuario1' }; // Simulación del usuario actual

  ngOnInit(): void {
    this.loadAllEstates(); // Carga todas las propiedades al inicializar el componente
  }

  loadAllEstates() {
    this.estates = this.loadEstatesFromLocalStorage();
    console.log('Loaded All Estates:', this.estates);
  }

  private loadEstatesFromLocalStorage(): any[] {
    return Object.keys(localStorage)
      .map(key => {
        const item = localStorage.getItem(key);
        return this.parseItem(item, key);
      })
      .filter(estate => estate && estate.id !== undefined);
  }

  private parseItem(item: string | null, key: string): any | null {
    try {
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing item ${key}:`, error);
      return null;
    }
  }
}

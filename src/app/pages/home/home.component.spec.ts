import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchBarComponent } from '../../search-bar/search-bar.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, SearchBarComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    estates: any[] = [];
    filteredEstates: any[] = [];

    ngOnInit(): void {
        this.loadAllEstates(); // Carga todas las propiedades al inicializar el componente
    }

    loadAllEstates() {
        this.estates = this.loadEstatesFromLocalStorage();
        this.filteredEstates = this.estates; // Inicialmente mostramos todas las propiedades
    }

    private loadEstatesFromLocalStorage(): any[] {
        return Object.keys(localStorage)
            .map(key => {
                const item = localStorage.getItem(key);
                return this.parseItem(item, key);
            })
            .filter(estate => estate && estate.id !== undefined); // Filtrar propiedades válidas
    }

    private parseItem(item: string | null, key: string): any | null {
        try {
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error parsing item ${key}:`, error);
            return null;
        }
    }
    this.filteredEstates = this.estates.filter(estate => {
      console.log('Evaluando propiedad:', estate); // Ver qué propiedad se evalúa
      if (estate && estate.id !== undefined) {
          return (
              estate.title.toLowerCase().includes(lowerQuery) ||
              estate.description.toLowerCase().includes(lowerQuery) ||
              estate.address.toLowerCase().includes(lowerQuery) ||
              estate.pricePerNight.toString().includes(lowerQuery) ||
              estate.bedrooms.toString().includes(lowerQuery) ||
              estate.bathrooms.toString().includes(lowerQuery) ||
              estate.maxCapacity.toString().includes(lowerQuery) ||
              (estate.photos && estate.photos.some(photo => photo.toLowerCase().includes(lowerQuery)))
          );
      }
      return false;
  });
  
}

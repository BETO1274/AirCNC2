import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchBarComponent } from '../../layout/components/search-bar/search-bar.component';
import Swal from 'sweetalert2';
import { Estates } from '../../interfaces/user.interface';


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

    handleSearch(event: { query: string}) {
        const {query} = event;
        this.filteredEstates = this.estates.filter(estate => {
            const matchesQuery =estate.description.toLowerCase().includes(query) ||
            estate.title.toLowerCase().includes(query) ||
            estate.address.toLowerCase().includes(query) ||
            estate.pricePerNight.toString().includes(query) || // Filtrar por precio
            estate.bedrooms.toString().includes(query) || // Filtrar por habitaciones
            estate.bathrooms.toString().includes(query) || // Filtrar por baños
            estate.maxCapacity.toString().includes(query) ;
          
            return matchesQuery;
        });
    }


    openModal(estate: Estates) {
        Swal.fire({
          title: 'Detalles de la Propiedad',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <img src="${estate.photos[0] || 'ruta/por_defecto.jpg'}" alt="Imagen de la propiedad" style="width: 100%; max-width: 300px; border-radius: 10px; margin-bottom: 15px;">
              <h3>${estate.title}</h3>
              <p>${estate.description}</p>
              <p><strong>Dirección:</strong> ${estate.address}</p>
              <p><strong>Precio por Noche:</strong> $${estate.pricePerNight}</p>
              <p><strong>Número de Habitaciones:</strong> ${estate.bedrooms}</p>
              <p><strong>Número de Baños:</strong> ${estate.bathrooms}</p>
              <p><strong>Capacidad Máxima:</strong> ${estate.maxCapacity}</p>
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
        });
      }
}
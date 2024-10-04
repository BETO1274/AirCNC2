import { Component, OnInit } from '@angular/core';


import Swal from 'sweetalert2';
import { EstatesService } from '../../services/estates.service';
import { Estates } from '../../interfaces/user.interface';
import { SearchBarComponent } from '../../layout/components/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone:true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports:[SearchBarComponent,CommonModule],
 
})
export class HomeComponent implements OnInit {
  estates: Estates[] = [];
  filteredEstates: Estates[] = [];
  query: string = '';

  constructor(private estatesService: EstatesService) {}

  ngOnInit() {
    this.loadAllEstates();
  }

  loadAllEstates() {
    this.estates = this.estatesService.getAllEstates();
    this.filteredEstates = [...this.estates]; // Copia para evitar referencia directa
  }

  handleSearch(query: string) {
    this.query = query.toLowerCase();
    this.filteredEstates = this.estates.filter(estate => {
      return estate.title.toLowerCase().includes(this.query) ||
             estate.description.toLowerCase().includes(this.query) ||
             estate.address.toLowerCase().includes(this.query) ||
             estate.pricePerNight.toString().includes(this.query) ||
             estate.bedrooms.toString().includes(this.query) ||
             estate.bathrooms.toString().includes(this.query) ||
             estate.maxCapacity.toString().includes(this.query);
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
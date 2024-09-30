import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Estates, User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estates',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './estates.component.html',
  styleUrl: './estates.component.css'
})
export class EstatesComponent implements OnInit {
  estates: Estates[] = [];
  private lastId: number = 0; // Contador para el ID autoincrementable
  currentUser: User | null = null;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.loadEstates();
  }

  loadEstates() {
    const currentUser = this.auth.getCurrentUser();
    this.estates = currentUser ? (currentUser.estates || []) : [];
    this.lastId = this.estates.length ? Math.max(...this.estates.map(prop => prop.id)) : 0; // Obtener el ID más alto
  }

 async addProperty() {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar Propiedad',
      html: `
        <input id="title" class="swal2-input" placeholder="Título">
        <input id="description" class="swal2-input" placeholder="Descripción">
        <input id="address" class="swal2-input" placeholder="Dirección">
        <input id="pricePerNight" class="swal2-input" placeholder="Precio por Noche" type="number">
        <input id="bedrooms" class="swal2-input" placeholder="Número de Habitaciones" type="number">
        <input id="bathrooms" class="swal2-input" placeholder="Número de Baños" type="number">
        <input id="maxCapacity" class="swal2-input" placeholder="Capacidad Máxima" type="number">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;
        const address = (document.getElementById('address') as HTMLInputElement).value;
        const pricePerNight = parseFloat((document.getElementById('pricePerNight') as HTMLInputElement).value);
        const bedrooms = parseInt((document.getElementById('bedrooms') as HTMLInputElement).value, 10);
        const bathrooms = parseInt((document.getElementById('bathrooms') as HTMLInputElement).value, 10);
        const maxCapacity = parseInt((document.getElementById('maxCapacity') as HTMLInputElement).value, 10);

        if (!title || !description || !address || isNaN(pricePerNight) || isNaN(bedrooms) || isNaN(bathrooms) || isNaN(maxCapacity)) {
          Swal.showValidationMessage('Por favor, completa todos los campos correctamente.');
        }

        return {
          id: ++this.lastId, // Incrementar y asignar un nuevo ID
          title,
          description,
          address,
          pricePerNight,
          bedrooms,
          bathrooms,
          maxCapacity,
          photos: []
        };
      },
      showCancelButton: true,

    });
    if (formValues) {
      // Crear un nuevo objeto de usuario
      const updateEstate: Estates = {
        ...this.currentUser!,
        id: formValues.id,
        title: formValues.title,
        description: formValues.description,
        address: formValues.address,
        pricePerNight: formValues.pricePerNight,
        bedrooms: formValues.bedrooms,
        bathrooms: formValues.bathrooms,
        maxCapacity: formValues.maxCapacity,
        photos: []
      };
      localStorage.setItem(this.currentUser?.username!, JSON.stringify(updateEstate));

      this.auth.addEstate(updateEstate);
      Swal.fire('¡Agregado!', 'La propiedad ha sido agregada.', 'success');
    }

   
  }
};



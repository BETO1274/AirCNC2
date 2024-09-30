import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Estates, User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { checkPrime } from 'crypto';

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
  isUserActive: boolean = false;

  ngOnInit() {
    this.loadEstates();
    this.checkUserActive();
  }

  checkUserActive() {
    const currentUser = this.auth.getCurrentUser();
    this.isUserActive = currentUser !== null; // Establecer verdadero si hay un usuario activo
  }
  loadEstates() {
    const currentUser = this.auth.getCurrentUser();
    this.estates = currentUser ? (currentUser.estates || []) : [];
    this.lastId = this.estates.length ? Math.max(...this.estates.map(prop => prop.id)) : 0; // Obtener el ID más alto
  }

  async addEstate() {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar Propiedad',
      html: `

      
        <input id="title" class="swal2-input" placeholder="Título" >
        <input id="description" class="swal2-input" placeholder="Descripción" ">
        <input id="address" class="swal2-input" placeholder="Dirección"">
        <input id="pricePerNight" class="swal2-input" placeholder="Precio por Noche" type="number"">
        <input id="bedrooms" class="swal2-input" placeholder="Número de Habitaciones" type="number"">
        <input id="bathrooms" class="swal2-input" placeholder="Número de Baños" type="number"">
        <input id="maxCapacity" class="swal2-input" placeholder="Capacidad Máxima" type="number"" >
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

  async updateEstate(estate: Estates) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Propiedad',
      html: `
        <label for="title">Título</label><br>
        <input id="title" class="swal2-input" value="${estate.title}"><br>
        <label for="description">Descripcion</label><br>
        <input id="description" class="swal2-input" value="${estate.description}"><br>
        <label for="address">Direccion</label><br>
        <input id="address" class="swal2-input" value="${estate.address}"><br>
        <label for="pricePerNight">Precio por noche</label><br>
        <input id="pricePerNight" class="swal2-input" value="${estate.pricePerNight}" type="number"><br>
        <label for="bedrooms">Habitaciones</label><br>
        <input id="bedrooms" class="swal2-input" value="${estate.bedrooms}" type="number"><br>
        <label for="bathrooms">Baños</label><br>
        <input id="bathrooms" class="swal2-input" value="${estate.bathrooms}" type="number"><br>
        <label for="maxCapacity">Capacidad maxima</label><br>
        <input id="maxCapacity" class="swal2-input" value="${estate.maxCapacity}" type="numb"><br>
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

        return {
          ...estate, // Mantener los campos existentes
          title,
          description,
          address,
          pricePerNight,
          bedrooms,
          bathrooms,
          maxCapacity
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

      this.auth.updateEstate(updateEstate);
      Swal.fire('¡Agregado!', 'La propiedad ha sido agregada.', 'success');
    }
  }

  async deleteProperty(estateId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.removeEstate(estateId); // Llama al método de eliminación
        this.loadEstates(); // Recargar propiedades
        Swal.fire('¡Eliminado!', 'La propiedad ha sido eliminada.', 'success');
      }
    });
  }
}



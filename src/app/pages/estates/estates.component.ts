import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Estates, User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from '../../services/supabase.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-estates',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.css']
})
export class EstatesComponent implements OnInit {

  private lastId: number = 0; // Contador para el ID autoincrementable
  currentUser: User | null = null;
  estates: Estates[] = []; // Para almacenar las propiedades cargadas
  photos:string[]=[]

  constructor(private auth: AuthService,private supabase:SupabaseService) { }
  isUserActive: boolean = false;

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.loadEstates();
    this.checkUserActive();
    this.lastId = this.getLastId(); // Establecer el último ID
  }

  checkUserActive() {
    this.isUserActive = this.currentUser !== null; // Establecer verdadero si hay un usuario activo
  }

  getLastId(): number {
    const estates = Object.keys(localStorage)
      .filter(key => key.startsWith(`${this.currentUser?.username}_`))
      .map(key => JSON.parse(localStorage.getItem(key)!));

    return estates.length > 0 ? Math.max(...estates.map(e => e.id)) : 0; // Devuelve el ID más alto
  }

  loadEstates() {
    if (this.currentUser) {
      this.estates = Object.keys(localStorage)
        .filter(key => key.startsWith(`${this.currentUser!.username}_`))
        .map(key => JSON.parse(localStorage.getItem(key)!));

        

      console.log('Loaded Estates:', this.estates);
    }
  }

  async addEstate() {
    if (!this.currentUser) {
      Swal.fire('Error', 'No hay un usuario activo.', 'error');
      return;
    }

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
          return null;
        }

        return {
          username: this.currentUser!.username,
          id: ++this.lastId,
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
      const newEstate = {
        username: formValues.username,
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

      try {
        localStorage.setItem(`${this.currentUser!.username}_${newEstate.id}`, JSON.stringify(newEstate));
        this.loadEstates();
        Swal.fire('¡Agregado!', 'La propiedad ha sido agregada.', 'success');
      } catch (error) {
        console.error('Error saving to localStorage', error);
      }
    }
  }

  async editEstate(estate: Estates) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Propiedad',
      html: `
        <input id="title" class="swal2-input" placeholder="Título" value="${estate.title}">
        <input id="description" class="swal2-input" placeholder="Descripción" value="${estate.description}">
        <input id="address" class="swal2-input" placeholder="Dirección" value="${estate.address}">
        <input id="pricePerNight" class="swal2-input" placeholder="Precio por Noche" type="number" value="${estate.pricePerNight}">
        <input id="bedrooms" class="swal2-input" placeholder="Número de Habitaciones" type="number" value="${estate.bedrooms}">
        <input id="bathrooms" class="swal2-input" placeholder="Número de Baños" type="number" value="${estate.bathrooms}">
        <input id="maxCapacity" class="swal2-input" placeholder="Capacidad Máxima" type="number" value="${estate.maxCapacity}">
        <input type="file" id="file-input"(change)="onUpload($event,estate)" style="display: none;">
        <label for="file-input" style="display: inline-block; padding: 10px 15px; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer; text-align: center; margin-top: 10px; margin-bottom: 10px;">Subir Imagen</label>
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
          return null;
        }
  
        return {
          id: estate.id,
          username: estate.username,
          title,
          description,
          address,
          pricePerNight,
          bedrooms,
          bathrooms,
          maxCapacity,
          photos: estate.photos
        };
      },
      showCancelButton: true,
    });
  
    if (formValues) {
      const updatedEstate = {
        username: formValues.username,
        id: formValues.id,
        title: formValues.title,
        description: formValues.description,
        address: formValues.address,
        pricePerNight: formValues.pricePerNight,
        bedrooms: formValues.bedrooms,
        bathrooms: formValues.bathrooms,
        maxCapacity: formValues.maxCapacity,
        photos: formValues.photos
      };
  
      try {
        localStorage.setItem(`${this.currentUser!.username}_${updatedEstate.id}`, JSON.stringify(updatedEstate));
        Swal.fire('¡Actualizado!', 'La propiedad ha sido actualizada.', 'success');
        this.loadEstates(); // Recargar la lista de propiedades
      } catch (error) {
        console.error('Error updating localStorage', error);
      }
    }
  }
  async deleteEstate(id: number) {

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
        try {
          localStorage.removeItem(`${this.currentUser!.username}_${id}`);
          this.loadEstates(); // Recargar la lista de propiedades después de eliminar
          Swal.fire('¡Eliminado!', 'La propiedad ha sido eliminada.', 'success');

        } catch (error) {
          console.error('Error deleting from localStorage', error);
        }
      }
    });
  }

  onUpload(event:Event,estate:Estates){
    
    let inputFile = event.target as HTMLInputElement;
    if(!inputFile.files || inputFile.files.length <= 0){
      return;
    }
    const file:File = inputFile.files[0];
    const fileName = uuidv4();
    const folderName = this.currentUser!.username+"/estates/"+`${this.currentUser!.username}_${estate.id}`;
    
    this.supabase.upload(file, fileName, folderName);
    this.photos=estate.photos
    this.photos.push('https://ffenhqwkmshxesotaasr.supabase.co/storage/v1/object/public/AirCNC/'+folderName+'/'+fileName,)
    
    const newEstate:Estates = {
     ...estate!,
    photos:this.photos
     }; 

     localStorage.setItem(`${this.currentUser!.username}_${estate.id}`, JSON.stringify(newEstate));
    this.ngOnInit()

}
}
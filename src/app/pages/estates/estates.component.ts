import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Estates, User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from '../../services/supabase.service';
import { RouterLink } from '@angular/router';
import { SearchBarComponent } from '../../layout/components/search-bar/search-bar.component';


@Component({
  selector: 'app-estates',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink,FormsModule,SearchBarComponent],
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.css']
})
export class EstatesComponent implements OnInit {

  private lastId: number = 0; // Contador para el ID autoincrementable
  currentUser: User | null = null;
  estates: Estates[] = []; // Para almacenar las propiedades cargadas
  photos:string[]=[]
  searchQuery: string = ''; // Query de búsqueda
  filteredEstates:Estates[]=[]

  constructor(private auth: AuthService,private supabase:SupabaseService) { }
  isUserActive: boolean = false;

  ngOnInit() {
 
    this.lastId = this.getLastId(); // Establecer el último ID
    this.currentUser = this.auth.getCurrentUser();
    this.loadAllEstates();
    this.checkUserActive();
   
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

  loadAllEstates() {
    this.estates = this.loadEstatesFromLocalStorage();
    this.filteredEstates = [...this.estates]; // Copia para evitar referencia directa
  }
  


private loadEstatesFromLocalStorage(): any[] {
  return Object.keys(localStorage)
      .map(key => {
          const item = localStorage.getItem(key);
          return this.parseItem(item, key);
      })
      .filter(estate => estate && estate.id !== undefined && this.currentUser!.username);
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
  const query= event.query.toLowerCase();
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
        this.loadAllEstates();
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
        <div style="display: flex; flex-direction: column; gap: 15px; max-width: 500px;">
          <div style="display: flex; align-items: center;">
            <label for="title" style="width: 150px; margin-right: 10px;">Título:</label>
            <input id="title" class="swal2-input" style="flex: 1; padding: 10px; border: 1px solid #ccc;" value="${estate.title}">
          </div>
          
          <div style="display: flex; align-items: center;">
            <label for="description" style="width: 150px; margin-right: 10px;">Descripción:</label>
            <textarea id="description" class="swal2-textarea" style="flex: 1; padding: 10px; border: 1px solid #ccc; resize: none;" rows="3">${estate.description}</textarea>
          </div>
          
          <div style="display: flex; align-items: center;">
            <label for="address" style="width: 150px; margin-right: 10px;">Dirección:</label>
            <input id="address" class="swal2-input" style="flex: 1; padding: 10px; border: 1px solid #ccc;" value="${estate.address}">
          </div>
          
          <div style="display: flex; align-items: center;">
            <label for="pricePerNight" style="width: 150px; margin-right: 10px;">Precio por Noche:</label>
            <input id="pricePerNight" class="swal2-input" type="number" style="flex: 1; padding: 10px; border: 1px solid #ccc;" value="${estate.pricePerNight}">
          </div>
          
          <div style="display: flex; align-items: center;">
            <label for="bedrooms" style="width: 150px; margin-right: 10px;">Número de Habitaciones:</label>
            <input id="bedrooms" class="swal2-input" type="number" style="flex: 1; padding: 10px; border: 1px solid #ccc;" value="${estate.bedrooms}">
          </div>
          
          <div style="display: flex; align-items: center;">
            <label for="bathrooms" style="width: 150px; margin-right: 10px;">Número de Baños:</label>
            <input id="bathrooms" class="swal2-input" type="number" style="flex: 1; padding: 10px; border: 1px solid #ccc;" value="${estate.bathrooms}">
          </div>
          
          <div style="display: flex; align-items: center;">
            <label for="maxCapacity" style="width: 150px; margin-right: 10px;">Capacidad Máxima:</label>
            <input id="maxCapacity" class="swal2-input" type="number" style="flex: 1; padding: 10px; border: 1px solid #ccc;" value="${estate.maxCapacity}">
          </div>
        </div>
      `,
      customClass: {
        container: 'custom-modal'
      },
      focusConfirm: false,
      preConfirm: () => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
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
        this.loadAllEstates(); // Recargar la lista de propiedades
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
          this.loadAllEstates(); // Recargar la lista de propiedades después de eliminar
          Swal.fire('¡Eliminado!', 'La propiedad ha sido eliminada.', 'success');

        } catch (error) {
          console.error('Error deleting from localStorage', error);
        }
      }
    });
  }

async onUpload(event: Event, estate: Estates) {
  let inputFile = event.target as HTMLInputElement;
  if (!inputFile.files || inputFile.files.length <= 0) {
      return;
  }

  const file: File = inputFile.files[0];
  const fileName = uuidv4(); // Genera un nombre único
  const folderName = `${this.currentUser!.username}/estates/${this.currentUser!.username}_${estate.id}`;

  try {
      await this.supabase.upload(file, fileName, folderName);
      const newPhotoUrl = `https://ffenhqwkmshxesotaasr.supabase.co/storage/v1/object/public/AirCNC/${folderName}/${fileName}`;
      
      // Copia el estate para evitar mutaciones
      const updatedEstate = { ...estate, photos: [...(estate.photos || []), newPhotoUrl] };

      // Guarda el estate actualizado en localStorage usando el ID
      localStorage.setItem(`${this.currentUser!.username}_${estate.id}`, JSON.stringify(updatedEstate));

      // Actualiza la lista de propiedades
      this.loadAllEstates();
  } catch (error) {
      console.error("Error al subir la imagen:", error);
  }
}

async deleteImage(photoUrl: string, estate: Estates, index: number) {
  // Extrae el nombre del archivo del URL
  const fileName = photoUrl.split('/').pop(); // Obtiene el nombre del archivo
  const folderName = `${this.currentUser!.username}/estates/${this.currentUser!.username}_${estate.id}`;

  // Elimina la imagen de Supabase
  this.supabase.delete(`${folderName}/${fileName}`).then(() => {
      // Elimina la imagen del array de fotos
      estate.photos.splice(index, 1);

      // Actualiza el estate en localStorage
      localStorage.setItem(`${this.currentUser!.username}_${estate.id}`, JSON.stringify(estate));

      // Recarga las propiedades (opcional)
      this.loadAllEstates();
  }).catch((error) => {
      console.error("Error al eliminar la imagen:", error);
  });
}


}
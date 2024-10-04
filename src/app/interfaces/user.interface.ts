export interface User{

username:string,                //Nombre de uauario
password:string,                //contraseña de usuario 
email?:string,                  //correo electronico                   //Propiedades del usuario
profilePicture?: string;         // URL de la foto de perfil
biography?: string;              // Biografía del usuario
}

export interface Estates{

    username:string,   
    id:number;
    title: string;              // Título de la propiedad
    description: string;        // Descripción de la propiedad
    address: string;            // Dirección de la propiedad
    pricePerNight: number;      // Precio por noche
    bedrooms: number;           // Número de habitaciones
    bathrooms: number;          // Númexro de baños
    maxCapacity: number;        // Capacidad máxima
    photos: string[];           // Array de URLs de fotos
}
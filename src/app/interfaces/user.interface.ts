export interface User{
username:string,                //Nombre de uauario
password:string,                //contraseña de usuario 
email?:string,                  //correo electronico 
estates?:[]                     //Propiedades del usuario
profilePicture?: string;         // URL de la foto de perfil
biography?: string;              // Biografía del usuario
}

export interface Estates{
    title: string;              // Título de la propiedad
    description: string;        // Descripción de la propiedad
    address: string;            // Dirección de la propiedad
    pricePerNight: number;      // Precio por noche
    numberOfRooms: number;      // Número de habitaciones
    numberOfBathrooms: number;  // Número de baños
    maxCapacity: number;        // Capacidad máxima
    photos: string[];           // Array de URLs de fotos
}
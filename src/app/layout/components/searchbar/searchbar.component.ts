import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})

export class SearchbarComponent {

  number = sessionStorage.length
  oli = sessionStorage
  direccion: string[] = [];

  ngOnInit(): void {

    for (let i = 0; i < this.number; i++) {
      let clave = sessionStorage.key(i);  // Obtiene la clave en la posición `i`

      if (clave !== null) {
        let valor =  JSON.parse(sessionStorage.getItem(clave) ?? "");  // Obtiene el valor asociado a la clave
        this.direccion.push(valor.address)
        console.log(valor.address)

      }
    }

  }

}
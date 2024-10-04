// search-bar.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  template: `
    <input type="text" (input)="handleInput($event)" placeholder="Buscar propiedades..." />
  `,
  styleUrls: ['./search-bar.component.css'],

  standalone:true,
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();

  handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.search.emit(inputElement.value); // Emitir solo la query
  }
}

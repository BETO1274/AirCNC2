import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css'],
    imports: [CommonModule, FormsModule]
})
export class SearchBarComponent {
    @Input() placeholder: string = 'Buscar...';
    @Output() search = new EventEmitter<{ query: string }>(); // Asegúrate de emitir un objeto

    query: string = '';

    onSearch() {
        this.search.emit({ query: this.query }); // Emitir cada vez que se busca
    }

    onInputChange() {
        this.search.emit({ query: this.query }); // Emitir en tiempo real
    }
}

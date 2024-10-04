import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  standalone:true,
  imports:[FormsModule]
})
export class SearchBarComponent {
  query: string = '';
  placeholder: string = 'Buscar propiedades...';

  @Output() search = new EventEmitter<string>();

  onInputChange() {
    this.search.emit(this.query);
  }
}

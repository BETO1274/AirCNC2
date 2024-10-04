import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/components/footer/footer.component';
import { NavbarComponent } from './layout/components/navbar/navbar.component';
import { SearchBarComponent } from './layout/components/search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FooterComponent,NavbarComponent,SearchBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AirCNC2';

  togglebtn() {
    let navBar = document.getElementById("navBar");
      navBar!.classList.toggle("hidemenu")
    }
    
    handleSearch(event: { query: string; type: string }) {
      console.log('Búsqueda realizada:', event);
    }

}

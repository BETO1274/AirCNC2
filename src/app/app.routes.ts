import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { EstatesComponent } from './pages/estates/estates.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [

    
    {path:'home',component:HomeComponent},
    {path:'login',component:LoginComponent},
    {path:'sign-up',component:SignUpComponent},
    {path:'estates',component:EstatesComponent},
    {path:'profile',component:ProfileComponent},
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'**', redirectTo:'home',pathMatch:'full'}

];

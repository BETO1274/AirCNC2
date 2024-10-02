import { EnvironmentInjector, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../envorinments/environment.dev';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
private supabase:SupabaseClient
currentUser: User | null = null;
  constructor(private auth:AuthService) { 
    this.supabase=createClient(environment.supabase.url,environment.supabase.secret)
  }
  

  async upload(file:File, fileName:string, folderName:string){
    this.currentUser = this.auth.getCurrentUser();
    const { error } = await this.supabase
      .storage
      .from("AirCNC")
      .upload(`${folderName}/${fileName}`, file);
    if(error){
      alert(error.message);
      return;
    }

   
    const { data } = await this.supabase
      .storage
      .from("AirCNC")
      .getPublicUrl(`${folderName}/${fileName}`)      
   return data.publicUrl
  }
}

import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  errorInicio : boolean = false;
  //loading     : boolean = false;
  crearUsuario:boolean = false;
  usuario     : any = {rol:true};

  constructor(private http: HttpClient) {}

  login(){
    // let formulario       :any = document.getElementById('login');
    // let formularioValido :boolean = formulario.reportValidity();
    
    if(this.usuario.username  && this.usuario.password){
      
      this.loginService().subscribe( data => this.inicarSesion(data))
    }else{
      alert("Ingrese todos los campos.")
    }
  }

  inicarSesion(resultado:any) {
    //this.loading = false;
    
    if(resultado){
      //si no es nulo
      localStorage.setItem("usuario",JSON.stringify(resultado));
      
      if(resultado.rol == false){
       location.href = "/tabs/tab2"; 
      }else {
        location.href = "/tabs/tab3";
      }
      
    }
    else {
      //si  es nulo
      this.errorInicio = true;
    }
  }
  
  loginService (){
    var httpOption = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }
    console.log("entro");
    return this.http.post<any>("http://localhost:8080/api/rol/login", this.usuario, httpOption);
  }

  crearCuenta(){
    this.crearUsuario = !this.crearUsuario;
    
  }


  // signin o iniciar sesion
  crear(){
    
    if(this.usuario.username && this.usuario.name && this.usuario.password){
    
      this.crearService()
          .subscribe( data => this
          .confirmar(data))
    }else{
      alert("Ingrese todos los datos.");
    }
  }
  
  confirmar(resultado: any){
   
    if(resultado){
      //si no es nulo
      alert("Usuario creado exitosamente.");
      this.usuario = {rol:true};
      this.crearCuenta();
    }
    else {
      //si  es nulo
      alert("Error al crear usuario.");
    }
  }

  crearService(){
    var httpOption = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }
    return this.http.post<any>("http://localhost:8080/api/rol/guardar", this.usuario, httpOption);
  }
  // regresar(){
  //   location.href = "/";
  // }

}

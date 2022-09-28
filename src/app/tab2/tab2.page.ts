import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pedido } from '../Entity/Pedido';
import { User } from '../Entity/User';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  usuario: any = {};

  user   : User [] = [];

  pedido : any = {};

  pedidos   : Pedido [] = [];
  loading   : boolean = false;
  crear     : boolean = false;
  fechaInicial : Date = new Date('01/01/1900');
  fechaFinal   : Date = new Date('01/01/1900');
  estadoFiltro: boolean = false;

  constructor(private http:HttpClient) {
    
    this.usuario = JSON.parse(localStorage.getItem("usuario")!);
    if(!this.usuario){
      location.href = "/tabs/tab1";
    }else{
      if(this.usuario.rol != false){
        location.href = "/tabs/tab1";
      }
      this.pedido = {lugar:this.pedido.lugar, fecha:this.pedido.fecha,estado:this.pedido.estado,user:new User}
      this.buscarPedidos();
      this.buscarUsuarios();
    }
  }

  logout(){
    localStorage.removeItem("usuario");
    location.href = "/tabs/tab1"
  }

  buscarPedidos(){
    this.loading = true;
    this.buscarPedidoServicio().subscribe(
    (response:Pedido[])=>{
      this.pedidos = response;
      this.loading = false;
      
    });

  }

  buscarPedidoServicio() :Observable<any> {
    return this.http.get<Pedido[]>("http://localhost:8080/api/pedido/buscar").pipe(
      catchError(e => "error"));
  }


  agregar(){
    this.crear = !this.crear;
  }
  
  crearPedido(form:any){
    let formularioValido :boolean = true;
   
    this.buscarUsuarios();

    if(formularioValido){
     this.loading = true;
     this.PedidoServicio().subscribe(
      data => this.finalizarActualizarPedido(data)
     );
    }
  }
  PedidoServicio(){
    
    var httpOption = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }
    this.pedido.estado = false;
    
    return this.http.post<Pedido[]>("http://localhost:8080/api/pedido/guardar", this.pedido, httpOption);
    
  }

  finalizarActualizarPedido(pedido: any){
    
    if(pedido){
      alert("Pedido Actualizado exitosamente.");
    }
    this.pedido = { lugar:this.pedido.lugar, fecha:this.pedido.fecha,estado:this.pedido.estado,user:new User}  
    this.crear = false;
    this.buscarPedidos();
  }



  buscarUsuarios(){
    this.loading = true;
    this.buscarUsuarioServicio().subscribe(
    (response:User[])=>{
      this.user = response;
    });

  }

  buscarUsuarioServicio() :Observable<any> {
    return this.http.get<User[]>("http://localhost:8080/api/rol").pipe(
      catchError(e => "error"));
  }

  filtrar(){
   if(this.fechaInicial.toString() != 'Mon Jan 01 1900 00:00:00 GMT-0456 (hora estándar de Colombia)' ){
      if(this.fechaFinal.toString() != 'Mon Jan 01 1900 00:00:00 GMT-0456 (hora estándar de Colombia)'){
        this.filtrarFecha(this.fechaInicial, this.fechaFinal).subscribe(data => {
          this.pedidos = data;
        });
      }else{
        alert("Debe seleccionar una fecha Final");
      }
    
   }else{
    alert("Debe seleccionar una fecha inicial");
   }
  }


  filtrarFecha(date1: Date, date2: Date):Observable<any>{
    return this.http.get<Pedido[]>("http://localhost:8080/api/pedido/buscar/" + date1 + "/" + date2).pipe(
      catchError(e => "error"));

  }

  filtrarEstado(){
    this.estadoFiltro = !this.estadoFiltro;

    this.filtroEstado(this.estadoFiltro).subscribe(data => {
      this.pedidos = data;
    })

  }

  filtroEstado(estado: boolean):Observable<any>{
    return this.http.get<Pedido[]>("http://localhost:8080/api/pedido/estado/" + estado).pipe(
      catchError(e => "error"));

  }
}

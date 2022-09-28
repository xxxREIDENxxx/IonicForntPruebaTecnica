import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pedido } from '../Entity/Pedido';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  usuario   : any = {};
  pedidos   : Pedido [] = [];
  actualizar: boolean = false;
  loading   : boolean = false;
 
  constructor(private http:HttpClient) {
    this.usuario = JSON.parse(localStorage.getItem("usuario")!);
    if(!this.usuario || this.usuario.rol != true){
      location.href = "/tabs/tab1";
    }else{
      
      this.buscarPedidos();
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
    });
  }

  buscarPedidoServicio() :Observable<any> {
    
    return this.http.get<Pedido[]>("http://localhost:8080/api/pedido/buscar/" + this.usuario.id).pipe(
      catchError(e => "error"));
  }

  agregar(pedido:Pedido){
    this.actualizar = !this.actualizar;
    this.actualizarPedido(pedido);
  }
  
  actualizarPedido(pedido:Pedido){
    //let formulario: any = document.getElementById('actualizar');
    let formularioValido :boolean = true;//formulario.reportValidity();
    if(formularioValido){
     this.loading = true;
     this.PedidoServicio(pedido.id, pedido).subscribe(
      data => this.finalizarActualizarPedido(data)
     );
    }
  }
  PedidoServicio(id: number, pedido:Pedido){
    var httpOption = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }
    pedido.estado = true;
    return this.http.put<any>("http://localhost:8080/api/pedido/editar/"+ id, pedido, httpOption);
  }

  finalizarActualizarPedido(pedido: any){
    if(pedido){
      alert("Pedido Actualizado exitosamente.");
    }
    this.actualizar = false;
    this.buscarPedidos();
  }
}

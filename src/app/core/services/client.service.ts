import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  listarClient() {
    return this.http.get('http://localhost:8080/api/persons/clients');
  }

  listarClientInactivos() {
    return this.http.get('http://localhost:8080/api/persons/clientsInac');
  }

  eliminarClient(clientId: number) {
    return this.http.delete(`http://localhost:8080/api/persons/delete/${clientId}`);
  }

  activarClient(clientId: number) {
    return this.http.put(`http://localhost:8080/api/persons/active/` + clientId, {});
  }

  crearPerson(datosPersona: any) {
    return this.http.post('http://localhost:8080/api/persons/crearClient', datosPersona);
  }

  actualizarPersona(id: number, datosPersona: any) {
    return this.http.put(`http://localhost:8080/api/persons/` + id, datosPersona);
  }

  //Api para la seccion de productos
  listarProduct() {
    return this.http.get('http://localhost:8080/api/products/productAc');
  }

  listarProductInactivos() {
    return this.http.get('http://localhost:8080/api/products/productIn');
  }

  eliminarProduct(productId: number) {
    return this.http.delete(`http://localhost:8080/api/products/delete/${productId}`);
  }

  activarProduct(productId: number) {
    return this.http.put(`http://localhost:8080/api/products/active/` + productId, {});
  }

  crearProduct(datosProduct: any) {
    return this.http.post('http://localhost:8080/api/products/crear', datosProduct);
  }

  actualizarProduct(id: number, datosProduct: any) {
    return this.http.put(`http://localhost:8080/api/products/` + id, datosProduct);
  }

  //Api para la seccion de productos
  listarSale() {
    return this.http.get('http://localhost:8080/api/sales');
  }

  registrarSale(datosSale: any) {
    return this.http.post('http://localhost:8080/api/sales/crear', datosSale);
  }

  actualizarVenta(id: number, datosSale: any) {
    return this.http.put(`http://localhost:8080/api/products/` + id, datosSale);
  }


  //Api para la seccion de productos
  listarPurchase() {
    return this.http.get('http://localhost:8080/api/purchase');
  }

  registrarPurchase(datosPurchase: any) {
    return this.http.post('http://localhost:8080/api/purchase/crear', datosPurchase);
  }

  actualizarCompra(id: number, datosPurchase: any) {
    return this.http.put(`http://localhost:8080/api/products/` + id, datosPurchase);
  }

  eliminarProducto(purchaseId: number) {
    return this.http.delete(`http://localhost:8080/api/purchase/delete/${purchaseId}`);
  }

}

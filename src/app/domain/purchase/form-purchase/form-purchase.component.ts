import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../../../core/services/client.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-purchase',
  templateUrl: './form-purchase.component.html',
  styleUrls: ['./form-purchase.component.scss']
})
export class FormPurchaseComponent implements OnInit {

  purchaseForm: FormGroup = new FormGroup({});
  proveedores: any[] = [];
  productos: any[] = [];
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<FormPurchaseComponent>,
    private fb: FormBuilder,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.purchaseForm = this.fb.group({
      supplierId: ['', Validators.required],
      type: ['', Validators.required],
      payment: ['', Validators.required],
      purchaseDetails: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getProveedores();
    this.getProductos();
    if (this.data) {
      this.initPurchaseForm();
      console.log('Data:', this.data);
    }
  }

  getProveedores(): void {
    this.clientService.listarClient().subscribe((res: any) => {
      console.log('Respuesta listarClient:', res); // Log para depuración
      this.proveedores = res;
    }, error => {
      console.error('Error al obtener proveedores:', error); // Log de error
    });
  }

  getProductos(): void {
    this.clientService.listarProduct().subscribe((res: any) => {
      console.log('Respuesta listarProduct:', res); // Log para depuración
      this.productos = res;
    }, error => {
      console.error('Error al obtener productos:', error); // Log de error
    });
  }

  initPurchaseForm(): void {
    this.purchaseForm.patchValue({
      supplierId: this.data.supplierId,
      type: this.data.type,
      payment: this.data.payment
    });
    this.data.purchaseDetails.forEach((detail: any) => {
      this.addPurchaseDetail(detail);
    });
  }

  get purchaseDetails(): FormArray {
    return this.purchaseForm.get('purchaseDetails') as FormArray;
  }

  addPurchaseDetail(detail?: any): void {
    this.purchaseDetails.push(this.fb.group({
      productId: [detail ? detail.productId : '', Validators.required],
      amount: [detail ? detail.amount : '', Validators.required]
    }));
  }

  removePurchaseDetail(index: number): void {
    this.purchaseDetails.removeAt(index);
  }

  savePurchase(): void {
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.confirmUpdatePurchase();
    } else {
      this.registerPurchase();
    }
  }

  registerPurchase(): void {
    this.clientService.registrarPurchase(this.purchaseForm.value).subscribe((res) => {
      console.log('Respuesta registrar compra:', res);
      this.showSuccessMessage();
      this.cancelar(true);
    });
  }

  confirmUpdatePurchase(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updatePurchase();
      }
    });
  }

  updatePurchase(): void {
    this.clientService.actualizarCompra(this.data.id, this.purchaseForm.value).subscribe((res) => {
      console.log('Respuesta actualizar compra:', res);
      this.showSuccessMessageUpdate();
      this.cancelar(true);
    });
  }

  cancelar(success?: boolean): void {
    this.dialogRef.close(success);
  }

  showSuccessMessage(): void {
    Swal.fire({
      icon: 'success',
      title: 'Compra registrada exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }

  showSuccessMessageUpdate(): void {
    Swal.fire({
      icon: 'success',
      title: 'Compra actualizada exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }
}



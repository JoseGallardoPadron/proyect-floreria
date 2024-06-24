import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../../../core/services/client.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-sale',
  templateUrl: './form-sale.component.html',
  styleUrls: ['./form-sale.component.scss']
})
export class FormSaleComponent implements OnInit {

  saleForm: FormGroup = new FormGroup({});
  personas: any[] = [];
  productos: any[] = [];
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<FormSaleComponent>,
    private fb: FormBuilder,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.saleForm = this.fb.group({
      personId: ['', Validators.required],
      salesType: ['', Validators.required],
      payment: ['', Validators.required],
      saleDetails: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getPersonas();
    this.getProductos();
    if (this.data) {
      this.initSaleForm();
      console.log('Data:', this.data);
    }
  }

  getPersonas(): void {
    this.clientService.listarClient().subscribe((res: any) => {
      console.log('Respuesta listarClient:', res); // Log para depuración
      this.personas = res;
    }, error => {
      console.error('Error al obtener personas:', error); // Log de error
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

  initSaleForm(): void {
    this.saleForm.patchValue({
      personId: this.data.personId,
      salesType: this.data.salesType,
      payment: this.data.payment
    });
    this.data.saleDetails.forEach((detail: any) => {
      this.addSaleDetail(detail);
    });
  }

  get saleDetails(): FormArray {
    return this.saleForm.get('saleDetails') as FormArray;
  }

  addSaleDetail(detail?: any): void {
    this.saleDetails.push(this.fb.group({
      productId: [detail ? detail.productId : '', Validators.required],
      amount: [detail ? detail.amount : '', Validators.required]
    }));
  }

  removeSaleDetail(index: number): void {
    this.saleDetails.removeAt(index);
  }

  saveSale(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.confirmUpdateSale();
    } else {
      this.registerSale();
    }
  }

  registerSale(): void {
    this.clientService.registrarSale(this.saleForm.value).subscribe((res) => {
      console.log('Respuesta registrar venta:', res);
      this.showSuccessMessage();
      this.cancelar(true);
    });
  }

  confirmUpdateSale(): void {
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
        this.updateSale();
      }
    });
  }

  updateSale(): void {
    this.clientService.actualizarVenta(this.data.id, this.saleForm.value).subscribe((res) => {
      console.log('Respuesta actualizar venta:', res);
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
      title: 'Venta registrada exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }

  showSuccessMessageUpdate(): void {
    Swal.fire({
      icon: 'success',
      title: 'Venta actualizada exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }
}


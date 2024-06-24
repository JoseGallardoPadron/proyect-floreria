import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../../../core/services/client.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss'
})
export class FormProductComponent implements OnInit{
  productForm: FormGroup = new FormGroup({});
  errorMessage: string ='';

  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void{
    this.initProductForm();
    console.log('Data :', this.data);
  }


  // Validacion para solo letras
  onlyLettersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const valid = /^[a-zA-Z\s]*$/.test(value);
      return valid ? null : { onlyLetters: true };
    };
  }


  //Para guardar un registro
  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.confirmUpdateProduct();
    } else {
      this.registerProduct();
    }
  }

  //Enviar los datos del registro guardado
  registerProduct() {
    this.clientService.crearProduct(this.productForm.value).subscribe((res) => {
      console.log('Respuesta registrar cliente:', res);
      this.showSuccessMessage();
      this.cancelar(true);
    })
  }

  //Confirmar la actualizacion de un registro
  confirmUpdateProduct() {
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
        this.updateProduct();
      }
    });
  }

  //Actualizar cambios del registro
  updateProduct() {
    this.clientService.actualizarProduct(this.data.id, this.productForm.value).subscribe((res) => {
      console.log('Respuesta registrar producto:', res);
      this.showSuccessMessageUpdate();
      this.cancelar(true);
    })
  }

  //Validacion para el formulario
  initProductForm() {
    this.productForm = this.fb.group({
      type: ['',[Validators.required]],
      names: ['',[Validators.required, this.onlyLettersValidator()]],
      description: ['',[Validators.required, this.onlyLettersValidator()]],
      price: ['',[Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      stock: ['',[Validators.required]],
    });

    if (this.data) {
      this.productForm.patchValue(this.data);
    }
  }

  get form() {
    return this.productForm.controls;
  }

  // Método para cerrar el diálogo
  cancelar(success?: boolean) {
    this.dialogRef.close(success);
  }

  //Notificacion de guardado exitoso
  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Registro añadido exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }

  //Notificacion de actualizado exitoso
  showSuccessMessageUpdate() {
    Swal.fire({
      icon: 'success',
      title: 'Registro actualizado exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }
}

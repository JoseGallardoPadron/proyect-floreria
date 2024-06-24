import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../../../core/services/client.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-person',
  templateUrl: './form-person.component.html',
  styleUrls: ['./form-person.component.scss']
})
export class FormPersonComponent implements OnInit{

  personForm: FormGroup = new FormGroup({});
  errorMessage: string ='';

  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void{
    this.initPersonForm();
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
  savePerson() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.confirmUpdatePerson();
    } else {
      this.registerPerson();
    }
  }

  //Enviar los datos del registro guardado
  registerPerson() {
    this.clientService.crearPerson(this.personForm.value).subscribe((res) => {
      console.log('Respuesta registrar cliente:', res);
      this.showSuccessMessage();
      this.cancelar(true);
    })
  }

  //Confirmar la actualizacion de un registro
  confirmUpdatePerson() {
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
        this.updatePerson();
      }
    });
  }

  //Actualizar cambios del registro
  updatePerson() {
    this.clientService.actualizarPersona(this.data.id, this.personForm.value).subscribe((res) => {
      console.log('Respuesta registrar cliente:', res);
      this.showSuccessMessageUpdate();
      this.cancelar(true);
    })
  }

  //Validacion para el formulario
  initPersonForm() {
    this.personForm = this.fb.group({
      typeDocument: ['',[Validators.required]],
      numberDocument: ['',[Validators.required, Validators.maxLength(15), Validators.minLength(8)]],
      names: ['',[Validators.required, this.onlyLettersValidator()]],
      lastNames: ['',[Validators.required, this.onlyLettersValidator()]],
      cellPhone: ['',[Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      email: ['',[Validators.required, Validators.email]],
      users: [],
      password: [],
    });

    if (this.data) {
      this.personForm.patchValue(this.data);
    }
  }

  get form() {
    return this.personForm.controls;
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

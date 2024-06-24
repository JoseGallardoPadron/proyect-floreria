import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormPersonComponent } from '../client/form-person/form-person.component';
import { ClientService } from '../../core/services/client.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface UserData {
  id: string;
  typeDocument: string;
  numberDocument: string;
  names: string;
  lastNames: string;
  typePerson: string;
  cellPhone: string;
  email: string;
  active: boolean;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit{

  public displayedColumns: string[] = ['id', 'typeDocument', 'numberDocument', 'names', 'lastNames', 'typePerson', 'cellPhone', 'email', 'action'];
  public dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);
  public showButton: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarClient();
  }

  listarClient() {
    const listFunction = this.showButton ? this.clientService.listarClientInactivos() : this.clientService.listarClient();
    listFunction.subscribe(
      (res: any) => {
        this.dataSource.data = res as UserData[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error al listar clientes:', error);
      }
    );
  }


  toggleEstadoClientes() {
    this.showButton = !this.showButton;
    this.listarClient();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(person?: any) {
    const dlgRef = this.dialog.open(FormPersonComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px' },
      width: '700px',
      data: person
    });
    dlgRef.afterClosed().subscribe(res => {
      console.log('Se cerro el dialog con el valor:', res);
      if (res) {
        this.listarClient();
      }
    })
  }

  activar(clientId: number) {
    this.clientService.activarClient(clientId).subscribe(
      () => {
        console.log('Cliente activado correctamente');
        this.listarClient();
      },
      error => {
        console.error('Error al activar al cliente:', error);
      }
    );
  }


  eliminarCliente(clientId: number) {
    this.clientService.eliminarClient(clientId).subscribe(
      () => {
        console.log('Cliente eliminado correctamente');
        this.listarClient();
      },
      error => {
        console.error('Error al eliminar el cliente:', error);
      }
    );
  }
}

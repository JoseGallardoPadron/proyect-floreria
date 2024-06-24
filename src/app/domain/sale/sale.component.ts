import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../core/services/client.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormSaleComponent } from '../sale/form-sale/form-sale.component';

export interface SaleData {
  id: string;
  saleDate: string;
  salesType: string;
  fullName: string;
  payment: string;
  saleDetails: SaleDetail[];
}

export interface SaleDetail {
  productName: string;
  amount: number;
  price: number;
}

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss'
})

export class SaleComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'saleDate', 'fullName', 'salesType', 'payment', 'saleDetails', 'action'];
  public dataSource: MatTableDataSource<SaleData> = new MatTableDataSource<SaleData>([]);
  public showButton: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarSale();
  }

  listarSale() {
    const listFunction = this.showButton ? this.clientService.listarProductInactivos() : this.clientService.listarSale();
    listFunction.subscribe(
      (res: any) => {
        const transformedData: SaleData[] = res.map((sale: any) => {
          const saleDetails: SaleDetail[] = sale.saleDetails.map((detail: any) => ({
            productName: detail.product.names,
            amount: detail.amount,
            price: detail.price
          }));
          return {
            id: sale.id,
            saleDate: sale.saleDate,
            salesType: sale.salesType,
            fullName: `${sale.person.names} ${sale.person.lastNames}`.trim(),
            payment: sale.payment,
            saleDetails: saleDetails
          };
        });
        this.dataSource.data = transformedData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error al listar las ventas:', error);
      }
    );
  }

  toggleEstadoProducto() {
    this.showButton = !this.showButton;
    this.listarSale();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(sale?: any) {
    const dlgRef = this.dialog.open(FormSaleComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px' },
      width: '700px',
      data: sale
    });
    dlgRef.afterClosed().subscribe(res => {
      console.log('Se cerro el dialog con el valor:', res);
      if (res) {
        this.listarSale();
      }
    })
  }

  activar(saleId: number) {
    this.clientService.activarProduct(saleId).subscribe(
      () => {
        console.log('Venta activado correctamente');
        this.listarSale();
      },
      error => {
        console.error('Error al activar la venta:', error);
      }
    );
  }


  eliminarProducto(saleId: number) {
    this.clientService.eliminarProduct(saleId).subscribe(
      () => {
        console.log('Venta eliminada correctamente');
        this.listarSale();
      },
      error => {
        console.error('Error al eliminar la venta:', error);
      }
    );
  }

}

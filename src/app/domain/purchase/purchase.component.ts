import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../core/services/client.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormPurchaseComponent } from '../purchase/form-purchase/form-purchase.component';

export interface PurchaseData {
  id: string;
  purchaseDate: string;
  type: string;
  fullName: string;
  payment: string;
  purchaseDetails: PurchaseDetail[];
}

export interface PurchaseDetail {
  productName: string;
  amount: number;
  price: number;
}

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss'
})

export class PurchaseComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'purchaseDate', 'fullName', 'type', 'payment', 'purchaseDetails', 'action'];
  public dataSource: MatTableDataSource<PurchaseData> = new MatTableDataSource<PurchaseData>([]);
  public showButton: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarPurchase();
  }

  listarPurchase() {
    const listFunction = this.showButton ? this.clientService.listarProductInactivos() : this.clientService.listarPurchase();
    listFunction.subscribe(
      (res: any) => {
        const transformedData: PurchaseData[] = res.map((purchase: any) => {
          const purchaseDetails: PurchaseDetail[] = purchase.purchaseDetails.map((detail: any) => ({
            productName: detail.product.names,
            amount: detail.amount,
            price: detail.price
          }));
          return {
            id: purchase.id,
            purchaseDate: purchase.purchaseDate,
            type: purchase.type,
            fullName: `${purchase.supplier.businessName} ${purchase.supplier.type}`.trim(),
            payment: purchase.payment,
            purchaseDetails: purchaseDetails
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
    this.listarPurchase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(purchase?: any) {
    const dlgRef = this.dialog.open(FormPurchaseComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px' },
      width: '700px',
      data: purchase
    });
    dlgRef.afterClosed().subscribe(res => {
      console.log('Se cerro el dialog con el valor:', res);
      if (res) {
        this.listarPurchase();
      }
    })
  }

  activar(purchaseId: number) {
    this.clientService.activarProduct(purchaseId).subscribe(
      () => {
        console.log('Compra activado correctamente');
        this.listarPurchase();
      },
      error => {
        console.error('Error al activar la venta:', error);
      }
    );
  }


  eliminarProducto(purchaseId: number) {
    this.clientService.eliminarProduct(purchaseId).subscribe(
      () => {
        console.log('Compra eliminada correctamente');
        this.listarPurchase();
      },
      error => {
        console.error('Error al eliminar la compra:', error);
      }
    );
  }

}




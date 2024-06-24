import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LayoutComponent } from './layout/layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './domain/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ProductComponent } from './domain/product/product.component';
import { ClientComponent } from './domain/client/client.component';
import { MatTableModule} from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule} from '@angular/material/dialog';
import { FormPersonComponent } from './domain/client/form-person/form-person.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatFormFieldModule} from '@angular/material/form-field';
import { FormProductComponent } from './domain/product/form-product/form-product.component';
import { SaleComponent } from './domain/sale/sale.component';
import { FormSaleComponent } from './domain/sale/form-sale/form-sale.component';
import { PurchaseComponent } from './domain/purchase/purchase.component';
import { FormPurchaseComponent } from './domain/purchase/form-purchase/form-purchase.component';



@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    DashboardComponent,
    ProductComponent,
    ClientComponent,
    FormPersonComponent,
    FormProductComponent,
    SaleComponent,
    FormSaleComponent,
    PurchaseComponent,
    FormPurchaseComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    HttpClientModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { PurchaseComponent } from './domain/purchase/purchase.component';
import { SaleComponent } from './domain/sale/sale.component';
import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './domain/dashboard/dashboard.component';
import { ProductComponent } from './domain/product/product.component';
import { ClientComponent } from './domain/client/client.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'products',
        component: ProductComponent
      },
      {
        path: 'client',
        component: ClientComponent
      },
      {
        path: 'sale',
        component: SaleComponent
      },
      {
        path: 'purchase',
        component: PurchaseComponent
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { PageNotFoundComponent } from './products/page-not-found/page-not-found.component';
import { FormComponent } from './products/form/form.component';
import { StatisticsComponent } from './products/statistics/statistics.component';
import { SettingsComponent } from './products/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/productsList', pathMatch: 'full' },
  { path: 'productsList', component: ProductsListComponent },
  { path: 'addProducts', component: FormComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

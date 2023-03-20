import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormComponent } from './products/form/form.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ResizableDraggableComponent } from './products/form/resizable-draggable/resizable-draggable.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InputProductComponent } from './products/form/input-product/input-product.component';
import { MatSelectModule } from '@angular/material/select';
import { QuantityProductComponent } from './products/form/quantity-product/quantity-product.component';
import { InputShopComponent } from './products/form/input-shop/input-shop.component';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './products/page-not-found/page-not-found.component';
import { InvalidMessagesComponent } from './products/form/invalid-messages/invalid-messages.component';
import { StatisticsComponent } from './products/statistics/statistics.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProductRankingComponent } from './products/statistics/product-ranking/product-ranking.component';
import { ShopRankingComponent } from './products/statistics/shop-ranking/shop-ranking.component';
import { ProductAndShopRankingChartsComponent } from './products/statistics/product-and-shop-ranking-charts/product-and-shop-ranking-charts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SettingsComponent } from './products/settings/settings.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { ExpendableNavComponent } from './header/expendable-nav/expendable-nav.component';

import { MainNavComponent } from './header/main-nav/main-nav.component';
import { SocialMediaLinksComponent } from './header/social-media-links/social-media-links.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FormComponent,
    ProductsListComponent,
    ResizableDraggableComponent,
    InputProductComponent,
    QuantityProductComponent,
    InputShopComponent,
    PageNotFoundComponent,
    InvalidMessagesComponent,
    StatisticsComponent,
    ProductRankingComponent,
    ShopRankingComponent,
    ProductAndShopRankingChartsComponent,
    SettingsComponent,
    ExpendableNavComponent,

    MainNavComponent,
     SocialMediaLinksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    MatSelectModule,
    HttpClientModule,
    MatTabsModule,
    MatTableModule,
    MatButtonToggleModule,
    NgxChartsModule,
    MatRadioModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

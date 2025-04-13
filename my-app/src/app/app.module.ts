import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ArViewComponent } from './ar-view/ar-view.component';
import { MenuComponent } from './components/menu/menu.component';
import { ArViewerComponent } from './components/ar-viewer/ar-viewer.component';
import { ModelViewerComponent } from './components/model-viewer/model-viewer.component';

// Import and register model-viewer web components
import '@google/model-viewer';

@NgModule({
  declarations: [
    AppComponent,
    ArViewComponent,
    MenuComponent,
    ArViewerComponent,
    ModelViewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Needed for model-viewer web component
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AboutComponent } from './components/about/about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ByteSizePipe } from './pipes/byte-size.pipe';
import { TwoButtonModalComponent } from './components/two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from './components/one-button-modal/one-button-modal.component';
import { LastModifiedDatePipe } from './pipes/last-modified-date.pipe';
import { SystemTagsComponent } from './components/system-tags/system-tags.component';
import { FileDetailsComponent } from './components/file-details/file-details.component';
import { TagsPipe } from './pipes/tags.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    AboutComponent,
    PageNotFoundComponent,
    NavbarComponent,
    ByteSizePipe,
    TwoButtonModalComponent,
    OneButtonModalComponent,
    LastModifiedDatePipe,
    SystemTagsComponent,
    FileDetailsComponent,
    TagsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

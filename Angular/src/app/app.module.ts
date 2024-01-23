import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavbarComponent } from './components/ui/navbar/navbar.component';
import { TwoButtonModalComponent } from './components/ui/modal/two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from './components/ui/modal/one-button-modal/one-button-modal.component';
import { TagsPipe } from './pipes/tags.pipe';
import { FileBrowserComponent } from './components/file-browser/file-browser/file-browser.component';
import { LastModifiedPipe } from './pipes/last-modified.pipe';
import { SizePipe } from './pipes/size.pipe';
import { FileBrowserCurrentFolderComponent } from './components/file-browser/file-browser-current-folder/file-browser-current-folder.component';
import { FileBrowserSearchingComponent } from './components/file-browser/file-browser-searching/file-browser-searching.component';
import { FileBrowserTableComponent } from './components/file-browser/file-browser-table/file-browser-table.component';
import { FileBrowserTablePageComponent } from './components/file-browser/file-browser-table-page/file-browser-table-page.component';
import { FileDetailsComponent } from './components/file-details/file-details/file-details.component';
import { FileDetailsTableComponent } from './components/file-details/file-details-table/file-details-table.component';
import { FileDetailsFileTagsComponent } from './components/file-details/file-details-file-tags/file-details-file-tags.component';
import { FileTagsComponent } from './components/file-tags/file-tags.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    PageNotFoundComponent,
    NavbarComponent,
    TwoButtonModalComponent,
    OneButtonModalComponent,
    TagsPipe,
    FileBrowserComponent,
    LastModifiedPipe,
    SizePipe,
    FileBrowserCurrentFolderComponent,
    FileBrowserSearchingComponent,
    FileBrowserTableComponent,
    FileBrowserTablePageComponent,
    FileDetailsComponent,
    FileDetailsTableComponent,
    FileDetailsFileTagsComponent,
    FileTagsComponent,
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

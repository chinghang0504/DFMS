import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavbarComponent } from './components/user_interfaces/navbar/navbar.component';
import { TwoButtonModalComponent } from './components/user_interfaces/modal/two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from './components/user_interfaces/modal/one-button-modal/one-button-modal.component';
import { TagsPipe } from './pipes/tags.pipe';
import { FileBrowserComponent } from './components/file-browser/file-browser/file-browser.component';
import { LastModifiedPipe } from './pipes/last-modified.pipe';
import { SizePipe } from './pipes/size.pipe';
import { FileBrowserCurrentFolderComponent } from './components/file-browser/file-browser-current-folder/file-browser-current-folder.component';
import { FileBrowserTableComponent } from './components/file-browser/file-browser-table/file-browser-table.component';
import { FileBrowserTablePageComponent } from './components/file-browser/file-browser-table-page/file-browser-table-page.component';
import { FileDetailsComponent } from './components/file-details/file-details/file-details.component';
import { FileDetailsTableComponent } from './components/file-details/file-details-table/file-details-table.component';
import { FileDetailsFileTagsComponent } from './components/file-details/file-details-file-tags/file-details-file-tags.component';
import { TagsComponent } from './components/tags/tags.component';
import { LoadingComponent } from './components/user_interfaces/loading/loading.component';
import { FileBrowserFilterComponent } from './components/file-browser/file-browser-filter/file-browser-filter.component';

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
    FileBrowserTableComponent,
    FileBrowserTablePageComponent,
    FileDetailsComponent,
    FileDetailsTableComponent,
    FileDetailsFileTagsComponent,
    TagsComponent,
    LoadingComponent,
    FileBrowserFilterComponent,
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

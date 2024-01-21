import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { AboutComponent } from './components/about/about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FileBrowserComponent } from './components/file-browser/file-browser/file-browser.component';
import { FileDetailsComponent } from './components/file-details/file-details/file-details.component';
import { FileTagsComponent } from './components/file-tags/file-tags.component';

const routes: Routes = [
  { path: 'file-browser', component: FileBrowserComponent },
  { path: 'file-browser/file-details', component: FileDetailsComponent },
  { path: 'file-tags', component: FileTagsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '', redirectTo: '/file-browser', pathMatch: 'full' },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

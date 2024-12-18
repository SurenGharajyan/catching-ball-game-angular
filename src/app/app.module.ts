import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigFormComponent } from './components/config-form/config-form.component';
import { GamePlayModalComponent } from './components/game-modal/game-play-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigFormComponent,
    GamePlayModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from './services/player.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
    providers: [
        PlayerService
    ]
})
export class CurdTableSharedModule { }

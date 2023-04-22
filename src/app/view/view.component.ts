import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PokemonServiceService} from "../pokemon-service.service";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  pokemonData : {
    id: any;
    name: any;
    sprite: any;
    types: any;
    stats: any;
  } | undefined;

  @Input() inputPokemon: any;

  constructor(private pokemonService: PokemonServiceService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputPokemon']) {
      this.showPokemon();
    }
  }

  public showPokemon() {
    if (this.inputPokemon) {
      this.pokemonService.getPokemonByName(this.inputPokemon.name).subscribe((results : any) => {
        this.pokemonData = results;
      })
    }
  }
}

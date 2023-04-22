import {Component, OnInit, OnChanges, Output, EventEmitter, SimpleChanges} from '@angular/core';
import {PokemonServiceService} from "../pokemon-service.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{
  pokemonList: any[] = [];
  currentPage = 1;
  totalPages = 0;
  totalPokemons = 0;
  pageSize = 20;
  loadedPages: any[] = [];
  loadedPokemons: any[] = [];
  selectedPokemon: {
    name: any;
    urr: any;
  } | null = null;
  searchInput! : HTMLInputElement;

  @Output() pokemonSearch = new EventEmitter<any>();

  constructor(private pokemonService: PokemonServiceService) {}

  ngOnInit() {
    this.loadPokemons();
    this.searchInput = document.querySelector('#searchInput') as HTMLInputElement;
  }

  set setSelectedPokemon(value: any) {
    this.selectedPokemon = value;
    this.searchPokemon(this.selectedPokemon?.name);
  }

  public loadPokemons() {
    if (this.loadedPages.indexOf(this.currentPage) != -1) {
      this.pokemonList = this.loadedPokemons[this.currentPage-1];
      return;
    }

    this.pokemonService.getPokemons(this.currentPage).subscribe((results : any) => {
      this.loadedPokemons.push(results.results);

      this.pokemonList = results.results;
      this.loadedPages.push(this.currentPage);
      this.totalPokemons = results.count;
      this.totalPages = Math.ceil(results.count / this.pageSize);
    });
  }

  public nextPage() {
    this.currentPage++;
    this.loadPokemons();
  }

  public previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPokemons();
    }
  }

  public searchPokemon(name: string) {
    let pokemon = this.loadedPokemons.find(p => p.name === name.toLowerCase());
    if (pokemon) {
      this.selectedPokemon = pokemon;
      this.currentPage = Math.ceil((this.loadedPokemons.indexOf(this.selectedPokemon) + 1) / this.pageSize);
      this.loadPokemons();
      this.scrollIntoView();
      this.pokemonSearch.emit(this.selectedPokemon);
    } else {
      this.pokemonSearch.emit({name: name});
    }
  }

  private scrollIntoView() {
    setTimeout(() => {
      const selectedElement =
        document.getElementById((this.loadedPokemons.indexOf(this.selectedPokemon) + 1).toString());
      selectedElement?.scrollIntoView({behavior: 'smooth', block: 'center'});
      if (selectedElement?.classList.contains("selected")) {
        selectedElement?.classList.add("selected");
      }
    }, 100);
  }
}

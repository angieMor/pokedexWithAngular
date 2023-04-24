import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PokemonServiceService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}
  getPokemons(page: number): Observable<any> {
    const offset = (page-1) * 20;
    const url = `${this.apiUrl}?offset=${offset}&limit=20`;
    //
    return this.http.get(url).pipe(
      map((response: any) => {
        return {
          count: response.count,
          results: response.results
        }
      })
    )
  }

  getPokemonByName(name: string): Observable<any> {
    const url = `${this.apiUrl}/${name.toLowerCase()}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const types = [];
        let sprite: string | number = "";
        for (const type of response.types) {
          const nameType = type.type.name;
          console.log(nameType);
          types.push(nameType[0].toUpperCase() + nameType.slice(1));
        }
        if (response.sprites.versions["generation-v"]["black-white"].animated.front_default) {
          sprite = response.sprites.versions["generation-v"]["black-white"].animated.front_default;
        }
        return {
          id: response.id,
          name: response.name,
          sprite: sprite ? sprite : response.sprites.front_default,
          types: types.join(", "),
          stats: response.stats
        }
      })
    )
  }
}

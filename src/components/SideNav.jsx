import { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils";

export default function SideNav(prop) {
    const { selectedPokemon, setSelectedPokemon ,HandleCloseMenu, showSideMenu } = prop;
    const [searchValue, setSearchValue] = useState(''); // Corrected useState hook

    const filteredPokemon = first151Pokemon.filter((pokemon,pokemonIndex) => {
        if (getFullPokedexNumber(pokemonIndex).includes(searchValue)) { return true; }
        if (pokemon.toLowerCase().includes(searchValue.toLowerCase())) { return true; }
        return false;
    });

    return (
        <nav className={" " + (showSideMenu? ' open': '') }>
            <div className={"header " + (showSideMenu? ' open': '')}>
                <button onClick={HandleCloseMenu} className="open-nav-button">
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Pokedex</h1>
            </div>

            <input placeholder="e.g 002 or bulbasaur" value={searchValue} onChange={(e)=> {
                setSearchValue(e.target.value);
            }}/>
            {filteredPokemon.map((pokemon, pokemonIndex) => {
                const truePokedexNumber = first151Pokemon.indexOf(pokemon);
                return (
                    <button onClick={()=> {
                        setSelectedPokemon(truePokedexNumber);
                        HandleCloseMenu();} }
                    key={pokemonIndex} className={'nav-card '+ 
                    (pokemonIndex === selectedPokemon ? 'nav-card-selected': ' ') }>
                       <p>{getFullPokedexNumber(truePokedexNumber)}</p>
                       <p>{pokemon}</p>
                    </button>
                    )
            })}

        </nav>
    )
}
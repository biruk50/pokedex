import { useEffect, useState} from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard(props) {
    const { selectedPokemon } = props;
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skill, setSkill] = useState(null);
    const [loadingSkill, setLoadingSkill] = useState(false);

    const{ name, stats, types, height, weight, abilities, moves,sprites} = pokemonData || {};

    const img_list =Object.keys(sprites || {}).filter((val) => {
                    if (!sprites[val]) { return false } 
                    if (['versions', 'other'].includes(val)) { return false }
                    return true });
    
    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) { return; }

        let c = {};
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'));
        }
        if (move in c) {
            setSkill(c[move]);
            return;
        }

        try {
            setLoadingSkill(true);
            let response = await fetch(moveUrl);
            const moveData = await response.json();

            const description = moveData?.flavor_text_entries.filter((entry) => {
                return entry.version_group.name === 'firered-leafgreen';
            })[0]?.flavor_text;

            const skillData = {
                name: move,
                description
            };

            setSkill(skillData);
            c[move] = skillData;
            localStorage.setItem('pokemon-moves', JSON.stringify(c));
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoadingSkill(false);
        }
    }
        
    useEffect(() => {
        //if loading ,exit logic (since we don't want to refetch multiple times)
        //if we don't have access to local storage, exit logic
        if (loading || !localStorage) { return };

        //1.define cache
        let cache = {};
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'));
        }

        //2. check if selectedPokemon is in the cache,else api
        if (selectedPokemon in cache) {
            setPokemonData(cache[selectedPokemon]);
            return;
        }
        //3. fetch the data

        async function fetchPokemonData() {
            try {
                setLoading(true);
                const baseUrl = 'https://pokeapi.co/api/v2/';
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon);
                const response = await fetch(baseUrl + suffix);

                const data = await response.json();
                setPokemonData(data);
                //update the cache
                cache[selectedPokemon] = data;
                localStorage.setItem('pokedex', JSON.stringify(cache));
            }
            catch (error) {
                console.error(error.message);
            }
            finally {
                setLoading(false);
            }
        }

        fetchPokemonData();

    }, [selectedPokemon])

    if (loading || !pokemonData) {
        return (
            <div>
                <h4>Loading...</h4>
                <h2>{name}</h2>
            </div>
        )
    }

    return (
        //if skill is true ,render modal(conditional rendering)
        <div className="poke-card">
            {skill && ( <Modal handleCloseModal={() => { setSkill(null) }}> 
                <div>
                    <h6>Name</h6>
                    <h2 className="skill-name">{skill.name.replaceAll('-',' ')}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>

            </Modal>) }
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4> 
                <h2>{name}</h2>
            </div>
            <div className="">
                {types.map((typeObj,typeindex) =>
                {
                    return <TypeCard key={typeindex} type={typeObj?.type?.name} />
                } ) }          
            </div>
            <div className="img-container">
                {img_list.map((spritesUrl,index) => {
                    return <img key={index} src={sprites[spritesUrl]} alt={name} />
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                
                {
                    stats.map((statObj, statindex) => {
                        const {stat,base_stat} = statObj;
                        return (
                            <div key={statindex} className="stat-item">
                                <p>{stat?.name.replaceAll('-', ' ')}</p>
                                <h4>{base_stat}</h4>
                            </div>
                        )
                    })
                }
            </div>
            <h3> Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj, moveindex) => {
                    return (
                        <button className="button-card pokemon-move" 
                        key={moveindex} onClick={() => {fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)}}>
                            <p>{moveObj?.move?.name.replaceAll('-',' ')}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

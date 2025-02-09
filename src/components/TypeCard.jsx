import { pokemonTypeColors } from "../utils";

export default function TypeCard(props) {
    const { type } = props;
    return (
        <div className="type-tile" style={{ color: pokemonTypeColors[type]['color'], backgroundColor: pokemonTypeColors[type]['backgroundColor'] }}>
            <p>{type}</p>
        </div>
    )
}
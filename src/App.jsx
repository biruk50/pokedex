import { useState } from 'react'
import  Header  from './components/Header'
import  SideNav  from './components/SideNav'
import PokeCard from './components/PokeCard'

function App() {
  const [selectedPokemon,setSelectedPokemon] = useState(0);
  const [showSideMenu, setShowSideMenu] = useState(false);

  function HandleToggleMenu(){
    setShowSideMenu(!showSideMenu);//make it the opposite of what it currently is
  }

  function HandleCloseMenu(){
    setShowSideMenu(false);
  }
  return (
    <>
    <Header HandleToggleMenu={HandleToggleMenu}/>
    <SideNav selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} 
             HandleCloseMenu={HandleCloseMenu} showSideMenu={showSideMenu}/>
    <PokeCard selectedPokemon={selectedPokemon} /> 
    </>
  )
}

export default App

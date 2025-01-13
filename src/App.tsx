import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface Character {
  id: number;
  name: string;
  species: string;
  image: string;
}

interface CharacterState {
  characterData: Character[];
  displayedData: Character[];
  sortBy: string;
  page: number;
  total: number;
  indicator: string;
}
function App() {
  const [state, setState] = useState<CharacterState>({
    characterData: [],
    displayedData: [],
    sortBy: 'id',
    page: 1,
    total: 0,
    indicator: ''

  })
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`https://rickandmortyapi.com/api/character`)
        const totalCharacters = response.data.results.length;
        setState((prevState) => ({
          ...prevState,
          characterData: response.data.results,
          displayedData: response.data.results.slice(0, itemsPerPage),
          total: totalCharacters,
        }));

      }
      catch (error) {
        console.log("something went wrong check the api fetch ", error)
      }
    }
    fetchData()
    return () => { }
  }, [state.indicator])

  useEffect(() => {
    const startIndex = (state.page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const sortedData = [...state.characterData].sort((a, b) => {
      if (state.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.id - b.id;
    });
    setState((prevState) => ({
      ...prevState,
      displayedData: sortedData.slice(startIndex, endIndex),
    }));
  }, [state.page, state.sortBy, state.characterData])


  const handleNext = () => {
    if (state.page < Math.ceil(state.total / itemsPerPage)) {
      setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));
    }
  };

  const handlePrev = () => {
    if (state.page > 1) {
      setState((prevState) => ({ ...prevState, page: prevState.page - 1 }));
    }
  };

  return (
    <>
      <div className='bg-[#D3FFE6] h-screen w-screen px-4 sm:px-6 lg:px-8 '>
        <div className='flex justify-center w-full'>
          <div className=' py-8 max-w-[85rem]'>
            {/* header */}
            <div className='flex  w-full '>
              <div className='text-3xl font-medium'>Characters of Rick & Morty!</div>
              <div className='flex items-center ml-auto gap-4'>
                <input id='name' className='
                              checked:outline-offset-4 
                              checked:outline 
                              checked:outline-1 
                              checked:outline-[#60a85f]
                              checked:text-[#60a85f]
                              focus:ring-0
                              focus:ring-offset-0
                              bg-transparent
                              border-black
                              hover:cursor-pointer'
                  type='radio' checked={state.sortBy == 'name'}
                  onChange={() => setState(prevState => ({ ...prevState, sortBy: "name" }))}
                />
                <label htmlFor="name">Sort Name</label>
                <div className="relative">
                  <input
                    id='id'
                    className=' 
                              checked:outline-offset-4 
                              checked:outline 
                              checked:outline-1 
                              checked:outline-[#60a85f]
                              checked:text-[#60a85f]
                              focus:ring-0
                              focus:ring-offset-0
                              bg-transparent
                              border-black
                              hover:cursor-pointer
                            '
                    type='radio'
                    checked={state.sortBy == 'id'}
                    onChange={() => setState(prevState => ({ ...prevState, sortBy: "id" }))}
                  />
                </div>
                <label htmlFor="id">Sort ID</label>
              </div>



            </div>
            {/* content */}
            <div className='flex justify-center w-full py-12 '>
              <div className='grid grid-cols-3 gap-2'>
                {state.displayedData.map(item => (
                  <div key={item.id} className='w-full h-42 border-[3px] border-black rounded-md bg-white'>
                    <div className='grid grid-cols-5  '>
                      <div className='col-span-2 '>
                        <img src={item.image} alt="" className='bg-contain h-full w-full' />
                      </div>
                      <div className='flex flex-col  justify-center  col-span-3 px-2 w-full'>
                        <label className='text-xl' >{item.name}</label>
                        <label className='py-1'>{item.species}</label>
                      </div>

                    </div>
                  </div>))
                }
              </div>
            </div>
            {/* footer */}
            <div className='flex pt-32'>
              <button className='w-15 text-xl px-4 py-2 border-black border-2 rounded-full' onClick={handlePrev} disabled={state.page === 1}>Previous 9</button>
              <button className='ml-auto w-15 text-xl px-4 py-2 border-black border-2 rounded-full bg-green-700/65' onClick={handleNext} disabled={state.page === Math.ceil(state.total / itemsPerPage)} >Next 9</button>
            </div>
          </div>
        </div>
      </div></>
  )
}

export default App

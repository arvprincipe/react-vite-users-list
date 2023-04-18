import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import ListOfUsers from './components/ListOfUsers'
import { SortBy, type User } from './types.d'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColor] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const originalUsers = useRef<User[]>([])

  const toggleRowColor = () => {
    setShowColor(!showColors)
  }

  const sortUsersByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const deleteUser = (email: string) => {
    const filteredUser = users.filter((user) => user.email !== email)
    setUsers(filteredUser)
  }

  const handleReset = () => {
    setShowColor(false)
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  // one way
  /*
  const filteredUsers = filterCountry !== null && filterCountry.length > 0
    ? users.filter(user => {
      return user.location.country.toLocaleLowerCase().includes(filterCountry.toLocaleLowerCase())
    })
    : users

  const sortedUsers = sortByCountry
    ? filteredUsers.toSorted((a, b) => {
      return a.location.country.localeCompare(b.location.country)
    })
    : filteredUsers
    */

  const filteredUsers = useMemo(() => {
    console.log('calculate filter')
    return filterCountry != null && filterCountry.length > 0
      ? users.filter(user => {
        return user.location.country.toLocaleLowerCase().includes(filterCountry.toLocaleLowerCase())
      })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    console.log('calculate sorted')
    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  return (
    <div className="App">
      <h1>Listado de Usuarios</h1>
      <header>
        <button onClick={toggleRowColor}>Colorear Filas</button>
        <button onClick={sortUsersByCountry}>
          {sorting === SortBy.COUNTRY ? 'No ordernar por pais' : 'Ordenar por Pais'}
        </button>
        <button onClick={handleReset}>Restaurar estado inicial</button>
        <input type='text' placeholder='Filtra por pais' onChange={(e) => {
          setFilterCountry(e.target.value)
        }} />
      </header>
      <main>
        <ListOfUsers
          changeSorting={handleChangeSort}
          users={sortedUsers}
          showColors={showColors}
          handleDelete={deleteUser}
        />
      </main>
    </div>
  )
}

export default App

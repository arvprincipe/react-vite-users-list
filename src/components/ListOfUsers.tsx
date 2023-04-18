import { SortBy, type User } from '../types.d'

interface Props {
  users: User[]
  showColors: boolean
  handleDelete: (email: string) => void
  changeSorting: (sort: SortBy) => void
}

export default function ListOfUsers({ users, changeSorting, showColors, handleDelete }: Props) {

  return (
    <table>
      <thead>
        <tr>
          <th>Foto</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.NAME) }}>Nombre</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.LAST) }}>Apellido</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.COUNTRY) }}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody className={showColors ? 'table--showColors' : ''}>
        {users.map((user, index) => {
          const backgroundColor = index % 2 === 0 ? '#333' : '#555'
          const color = showColors ? backgroundColor : 'transparent'
          return (
            <tr key={user.email} >
              <td><img src={user.picture.thumbnail} /></td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => {
                  handleDelete(user.email)
                }}>Eliminar</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

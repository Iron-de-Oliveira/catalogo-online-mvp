import { useEffect } from 'react'
import api from '../services/server'

function App() {

  useEffect(() => {

    async function carregarProdutos() {

      try {

        const response = await api.get('/produtos')

        console.log(response.data)

      } catch (error) {

        console.log(error)

      }

    }

    carregarProdutos()

  }, [])

  return (
    <div>
      Testando API
    </div>
  )
}

export default App
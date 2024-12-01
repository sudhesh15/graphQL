import logo from './logo.svg';
import './App.css';
import { useQuery, gql } from '@apollo/client';

const query = gql`
  query getAllData {
    getTodos {
      id
      title
      completed
      user {
        name
      }
    }
  }
`

function App() {
  const { loading, error, data } = useQuery(query);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className="App">
      {JSON.stringify(data)}
    </div>
  );
}

export default App;

import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Página não encontrada!</h1>
      <button onClick={() => navigate('/')}>Home</button>
    </div>
  );
}

export default NotFound;

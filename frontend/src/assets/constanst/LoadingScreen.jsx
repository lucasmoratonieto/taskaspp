import { loader } from '../svg/icons'
function LoadingScreen() {

  return (
    <div>
        <h1>Loading</h1>
        <img src={loader} alt={loader} />
    </div>
  );
}

export default LoadingScreen;

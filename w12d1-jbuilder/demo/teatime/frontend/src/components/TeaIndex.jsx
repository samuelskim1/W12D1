import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { fetchAllTeas } from '../store/teaReducer';
import TeaIndexItem from './TeaIndexItem';


const TeaIndex = props => {

  //useSelector here lets us hook into the current state and update our TeaIndex
  //whenever the return value has a different value than the previous state,
  //it causes the component to rerender
  //rerenders are based off of the change in slice of state in the callback of that useSelector
  const teas = useSelector(state => Object.values(state.teas));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllTeas())
  }, []);
  return(
    <>
      <div className='tea-index-container'>
        <h2>Teas</h2>
        <ul className='teas-ul'>
        {teas.map(tea => (
          <TeaIndexItem key={tea.id} tea={tea}/>
        ))}
        </ul>
      </div>
      
    </>
  )
};

export default TeaIndex;
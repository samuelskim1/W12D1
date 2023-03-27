import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTea, fetchTea } from '../store/teaReducer';
import { transactionSelector } from "../store/transactionReducer";

const TeaDetail = ({ teaId }) => {
  //whenever state gets updated, useSelector gets invoked
  //useSelector requires a callback function that has state as the argument

  // state = {
  //   teas: {
  //     1: {},
  //     2: {},
  //     3: {}
  //   },
  //   transactions: {
  //     1:{},
  //     2:{},
  //     3:{}
  //   }
  // }

  //const tea = useSelector(selectTea);

  const tea = useSelector(state => state.teas[teaId])
  const dispatch = useDispatch();
  
  // const transactions = useSelector(state => Object.values(state.transactions))
  const transactions = useSelector(transactionSelector(tea.transactionIds));

useEffect(() =>  {
  // make a request to fetch tea information
  dispatch(fetchTea(teaId));
}, [])

  return (
    <div className="tea-detail">
      {/* add Tea Descriptions */}
      <h4>{tea.description}</h4>
      <p>Transactions</p>
      {/*<div>To be completed</div>*/}
      <ul>
        {transactions.map(transaction => {
          return (
            <li className="transaction" key= {transaction.id}>
              <p>Customer: {transaction.customer}</p>
              <p>Quantity: {transaction.quantity}</p>
              <p>Total: ${transaction.quantity * tea.price}</p>
            </li>
          )
        })}
      </ul>

    </div>
  )
}

export default TeaDetail;
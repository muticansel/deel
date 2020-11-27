// import React, { useEffect, useState } from 'react';
// import axios from 'axios'
// import '../../App.css';

// const ContractDetail = () => {
//     const [contract, setContract] = useState({});

//     useEffect(() => {
//         getContract()
//     }, [])

//     const getContract = async () => {
//         const resp = await axios.get('http://localhost:3001/contracts/:id', {
//             'headers': {'profile_id': 1}
//         });
//         await setContract(resp.data)
//     }

//     return (
//         <div className="parent">
//             <p>Evet</p>
//         </div>
//     )
// }

// export default ContractDetail
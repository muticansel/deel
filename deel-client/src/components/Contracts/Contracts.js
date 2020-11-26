import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Moment from 'moment'
import '../../App.css';

const Contracts = () => {
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        getContracts()
    }, [])

    const getContracts = async () => {
        const resp = await axios.get('http://localhost:3001/contracts');
        await setContracts(resp.data)
    }

    return (
        <div class="parent">
            {
                contracts.map(contract => {
                    return (
                        <div class="child">
                            <div class="content">
                                <h4 class="ui sub header">{contract.terms}</h4>
                                <div class="ui small feed">
                                    <div class="event">
                                        <div class="content">
                                            <div class="summary">
                                                <strong>Status: </strong>{contract.status}
                                            </div>
                                            <div class="summary">
                                                <strong>Created At: </strong>{Moment(contract.createdAt).format('YYYY-MM-DD')}
                                            </div>
                                            <div class="summary">
                                                <strong>Updated At: </strong>{Moment(contract.updatedAt).format('YYYY-MM-DD')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Contracts
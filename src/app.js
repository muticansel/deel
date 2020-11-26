const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const { Op } = require("sequelize");
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)


/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
    const profile_id = req.get('profile_id')
    const { Contract } = req.app.get('models')
    const { id } = req.params
    const contract = await Contract.findOne({ where: { id } })

    if(contract.ContractorId !== profile_id || contract.ClientId !== profile_id)
        return res.status(404).end()
    if (!contract) 
        return res.status(404).end()
    res.json(contract)
})

// TASK 2
/**
 * @returns all contracts that is not terminated
 */
app.get('/contracts', async (req, res) => {
    const { Contract } = req.app.get('models');

    const contracts = await Contract.findAll({
        where: {
            status: {
                [Op.not]: 'terminated'
            }
        }
    })
    return res.json(contracts)
})

// TASK 3
/**
 * @returns all unpaid jobs for a user, for active contracts only.
 */
app.get('/jobs/unpaid', async (req, res) => {
    const { Job } = req.app.get('models');

    const unpaidJobs = await Job.findAll({
        where: {
            paid: {
                [Op.not]: true
            }
        }
    })
    return res.json(unpaidJobs)
})

// TASK 4
app.post('/jobs/:job_id/pay', async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const { job_id } = req.params

    const theJobWillBePaid = await Job.findAll({
        where: {
            id: job_id
        },
        include: [
            {
                model: Contract, include: [
                    { model: Profile, as: 'Contractor' },
                    { model: Profile, as: 'Client' }
                ]
            }
        ]
    })

    try {
        if(theJobWillBePaid[0].Contract.Client.balance > theJobWillBePaid[0].price){
            //C lient balance decrement
            await Profile.increment(
                { balance: -theJobWillBePaid[0].price },
                { where: { id: theJobWillBePaid[0].Contract.ClientId } }
            )
    
            // Contractor balance increment
            await Profile.increment(
                { balance: +theJobWillBePaid[0].price },
                { where: { id: theJobWillBePaid[0].Contract.ContractorId } }
            )
            return res.status(201).send('PAID successfully')
        }
    } catch (err) {
        console.log(err)
    }

    return res.json('Client balance is low to paid')
})

// TASK 5
app.post('/balances/deposit/:userId', async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const { userId } = req.params
    const { deposit } = req.body

    const totalAmount = await Job.findAll({
        attributes: [
            [sequelize.fn('sum', sequelize.col('price')), 'total']
        ],
        include: [
            {
                model: Contract,
                where: {
                    ClientId: userId
                }
            }
        ],
        raw: true
    })

    try {
        if(deposit > (totalAmount[0].total * 0.25)){
            res.status(401).send("can't deposit more than 25% the total of jobs to pay")
        } else {
            Profile.increment(
                { balance: +deposit },
                { where: { id: userId } }
            )
            res.status(201).send("was deposited successfully")
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = app;

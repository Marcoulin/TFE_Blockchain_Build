const { assert } = require("chai");
const { Item } = require("react-bootstrap/lib/Breadcrumb");

const Marketplace = artifacts.require("Marketplace");

contract('Marketplace', (accounts) => {
    let martketplace

    before(async() => {
        marketplace = await Marketplace.deployed(); 
    })

    describe('deployment', async() => {
        it('deploys successfuly', async() => {
            const address = await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)

        })
    })
})
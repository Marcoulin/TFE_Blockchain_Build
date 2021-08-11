const { assert } = require('chai');

require('chai')
  .use(require('chai-as-promised'))
  .should()


const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace

    describe('deployment', async () => {
        
        
        before(async () => {
            marketplace = await Marketplace.deployed(); 
        })

        it('has a name', async () => {
            const name = await marketplace.name(); 
            assert.equal(name, 'Marketplace'); 
        })
    })

    describe('products', async () => {
        let result, productCount

        before(async () => {
            result = await marketplace.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), {from: seller})
            productCount  = await marketplace.productCounter(); 
        })

        it('creates products', async () => {
            //SUCCESS
            assert.equal(productCount, 1); 
            const event = result.logs[0].args

            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct'); 
            assert.equal(event.name, 'iPhone X', 'name is correct');
            assert.equal(event.owner, seller, 'owner is correct')
            assert.equal(event.purchased, false, 'bool is correct');

            
            // Failure => Product must have a name
            await await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
            // Failure => Product must have a price
            await await marketplace.createProduct('iPhone X', 0, { from: seller }).should.be.rejected;

        
        })

        it('reads products', async () => {
            const product = await marketplace.products(productCount); 

            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct'); 
            assert.equal(product.name, 'iPhone X', 'name is correct');
            assert.equal(product.owner, seller, 'owner is correct')
            assert.equal(product.purchased, false, 'bool is correct');
        })

        it('sells products', async () => {
            //track seller balance
            let oldSellerBalance; 
            oldSellerBalance = await web3.eth.getBalance(seller); 
            oldSellerBalance = new web3.utils.BN(oldSellerBalance); 

            result = await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether') });  
           
            const event = result.logs[0].args

            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct'); 
            assert.equal(event.name, 'iPhone X', 'name is correct');
            assert.equal(event.owner, buyer, 'owner is correct')
            assert.equal(event.purchased, true, 'bool is correct');

            //Check that seller receive the funds
            let newSellerBalance; 
            newSellerBalance = await web3.eth.getBalance(seller); 
            newSellerBalance = new web3.utils.BN(newSellerBalance); 

            let price; 
            price = web3.utils.toWei('1', 'Ether'); 
            price = new web3.utils.BN(price); 

            const expectedBalance = oldSellerBalance.add(price); 

            assert.equal(newSellerBalance.toString(), expectedBalance.toString()); 

            await marketplace.purchaseProduct(99, {from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;  

            await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;  
            
            await marketplace.purchaseProduct(productCount, {from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;  

            await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;  
            
        })
    })
})
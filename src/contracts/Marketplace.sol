pragma solidity >=0.4.21 <0.6.0;

contract Marketplace {
    string public name; 
    uint public productCounter = 0; 
    mapping(uint => Product) public products; 



    struct Product {
        uint id;
        string name; 
        uint price; 
        address payable owner; 
        bool purchased; 
    }

    event ProductCreated(
        uint id,
        string name, 
        uint price,
        address payable owner, 
        bool purchased 
    );

     event ProductPurchased(
        uint id,
        string name, 
        uint price,
        address payable owner, 
        bool purchased 
    );

    constructor() public {
        name = "Marketplace"; 
    }

    function createProduct(string memory _name, uint _price) public{

        require(bytes(_name).length > 0);
        require(_price > 0); 
         
        productCounter++; 

        products[productCounter] = Product(productCounter, _name, _price, msg.sender, false); 

        emit ProductCreated(productCounter, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable{
        //Fetch product 
        Product memory _product = products[_id]; 
        //Fetch owner 
        address payable _seller = _product.owner;
        //Make sure product is valid
        require(_product.id > 0 && _product.id <= productCounter); 
        require(msg.value >= _product.price); 
        require(!_product.purchased); 
        require(_seller != msg.sender); 
        //Purchase it/Transfer ownership to the buyer
        _product.owner = msg.sender; 
        //Mark as purchased
        _product.purchased = true; 
        //Update the product
        products[_id] = _product; 
        //Paying the seller 
        address(_seller).transfer(msg.value); 
        //Trigger an event
        emit ProductPurchased(productCounter, _product.name, _product.price, msg.sender, true);

    }

}
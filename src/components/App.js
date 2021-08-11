import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from "web3"; 
import Marketplace from '../abis/Marketplace.json';
import Navbar from './navbar/Navbar'; 
import Main from './main/Main'; 

class App extends Component {
 

  async componentWillMount(){
    await this.loadWeb3(); 
    await this.loadBlockchainData(); 
  }

  async loadWeb3() {

  
    
    if (window.ethereum) {
    
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider); 
    }
    // Non-dapp browsers...
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3; 
    //Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]}); 
    const networkId = await web3.eth.net.getId(); 
    const networkData = Marketplace.networks[networkId]; 
    if(networkData){
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address); 
      this.setState({marketplace}); 
      this.setState({loading: false}); 

    }else{
      window.alert("Network not detected"); 
    }
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
  }
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main createProduct={this.createProduct} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

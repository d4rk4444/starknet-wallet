# starknet-wallet
Script for generating Argent X wallets both with random mnemonics and using yours.      

## Description
The script has functions such as:   
- Creating a mnemonic and the required number of private keys to it     
- Creating mnemonics separately for each wallet     
- Creating private keys in the required number to your mnemonic  
- Creation of 1 private key for each mnemonic       

*The entire result will be in the **result** folder*

## Installation
Must have NodeJS version 18+, NPM 9+ installed

```
git clone https://github.com/d4rk4444/starknet-wallet.git
cd starknet-wallet
npm i
```

## Configuration
All required settings are in the .env file     
1. Required number of private keys      
      
**If you want to use your mnemonics**
Insert mnemonics in the mnemonic.txt file in this format:    
```
mnemonic1
mnemonic2
```

## Usage
`node index` or `npm run start`     
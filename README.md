# STILL IN IDEATION PHASE

-- TODO
A tool in vs code or your any favourite text editor / code editor  which can go through all the contracts in the src/ folder for a foundry / hardhat project and goes thru each function and generates the calldata method hash

for example : 
cast sig "createPair(address, address)" --> 0xc9c65396
cast 4byte 0xc9c65396  --> createPair(address,address)

Just they dont have to use cast : this tool would automatically take all the fns every second / minute these fns are introduced in the smart contract and saved in the dir / project the tool will automatically execute all the fns methods signature in a verifiable way . 

inherently it should do by making a method.txt in the root of forge/ hardhat project in the format of for all the .sol contracts by implementing this ( would be amazing to be vigilant before sending any transaction via cli ) 

FOR DEVS : 
               Method                       Fn Signature/Method
       - createPair(address, address) -->      0xc9c65396
       - etc etc                      -->     some signature
   ``` REQUIREMENT 
      cast by foundry / or any other way it should detect if any changes is there in the contracts/src folder / 

-- irl method updates / appending them methods / updating if any changes are there to be performed
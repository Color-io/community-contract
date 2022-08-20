bootstrap:
	yarn 


# To compile the entire project, building your smart contracts
compile: 
	npx hardhat compile


.PHONY: test
test: 
	npx hardhat test

# verify:
# 	npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"


# To clean the cache and delete compiled smart contracts
clean:
	npx hardhat clean 

prettier:
	npx prettier --write 'contracts/**/*.sol'

lint:
	npx prettier --list-different 'contracts/**/*.sol'


hhnet:
	npx hardhat node

gnet:
	ganache -p 8545 --chain.chainId 31337 


# To run a specific script in a specific network
deploy_hhnet:
	npx hardhat run scripts/deploy.ts --network localhost

deploy_gnet:
	npx hardhat run scripts/deploy.ts --network ganache

deploy_glnet:
	npx hardhat run scripts/deploy.ts --network goerli

deploy_mnet:
	npx hardhat run scripts/deploy.ts --network mumbai

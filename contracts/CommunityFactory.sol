// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

import "./CommunityBeacon.sol";
import "./Community.sol";

contract CommunityFactory {
    // mapping to have a track of all the communities
    mapping(address => address[]) public communities;
    CommunityBeacon immutable beacon;

    constructor(address _initBlueprint) {
        beacon = new CommunityBeacon(_initBlueprint);
    }

    function createCommunity(
        string memory _name,
        string memory _symbol,
        string memory _logoURL,
        string memory _bannerURL,
        string memory _description,
        string memory _nftImageURL,
        uint256 _nftSupply,
        uint256 _mintPrice
    ) public {
        BeaconProxy community = new BeaconProxy(
            address(beacon),
            abi.encodeWithSelector(
                Community(address(0)).initialize.selector,
                _name,
                _symbol,
                _description,
                _logoURL,
                _bannerURL,
                _nftImageURL,
                _mintPrice,
                _nftSupply,
                msg.sender
            )
        );
        communities[msg.sender].push(address(community));
    }

    function getOwnerCommunities(address _owner) external view returns (address[] memory) {
        return communities[_owner];
    }

    function getBeacon() public view returns (address) {
        return address(beacon);
    }

    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }

    function getAllCommunities() external view returns (address[] memory) {
        address[] memory allCommunities = new address[](communities[msg.sender].length);
        for (uint256 i = 0; i < communities[msg.sender].length; i++) {
            allCommunities[i] = communities[msg.sender][i];
        }
        return allCommunities;
    }
}

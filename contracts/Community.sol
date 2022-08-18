// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract Community is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;

    uint256 public x;
    CommunityDetails public communityDetails;

    struct CommunityDetails {
        string name;
        string symbol;
        string description;
        string logoURL;
        string bannerURL;
        string nftImageURL;
        uint256 nftPrice;
        uint256 nftSupply;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name,
        string memory symbol,
        string memory logoURL,
        string memory bannerURL,
        string memory description,
        string memory nftImageURL,
        uint256 _nftSupply,
        uint256 _mintPrice,
        address _owner
    ) public initializer {
        __ERC721_init(name, symbol);
        __Ownable_init();
        _transferOwnership(_owner);
        communityDetails = CommunityDetails(name, symbol, description, logoURL, bannerURL, nftImageURL, _mintPrice, _nftSupply);
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function setX(uint256 _newX) external onlyOwner {
        x = _newX;
    }

    function getLFG() external pure returns (string memory) {
        return "LFG";
    }
}

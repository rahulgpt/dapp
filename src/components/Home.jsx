import WalletBalance from "./WalletBalance";
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import AbstractStuff from '../artifacts/contracts/MyNFT.sol/AbstractStuff.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, AbstractStuff.abi, signer);

function Home() {
    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
        getCount();
    }, [])

    const getCount = async () => {
        const count = await contract.count();
        console.log(count);
        count._hex > 3 ? setTotalMinted(3) : setTotalMinted(parseInt(count._hex));
    }

    return (
        <div>
            <WalletBalance totalMinted={totalMinted} />

            <h1>Abstract Stuff NFT Collection</h1>

            {Array(totalMinted < 3 ? totalMinted + 1 : 3).fill(0).map((_, i) => (
                <div key={i}>
                    <NFTImage tokenId={i} getCount={getCount} />
                </div>
            ))}

            {totalMinted === 3 && (<h1>All NFTs has been minted! 🚩</h1>)}
        </div>
    )
}

function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmdV55sJDGvBTexNVw4Vs5f1Ni6tD25A2gw6Vwv75HEuFB';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.jpg`;

    // const imageURI = `img/${tokenId}.png`;

    const [isMinted, setIsMinted] = useState(false);

    useEffect(() => {
        getMintedStatus();
    }, [isMinted])

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result);
        setIsMinted(result);
    }

    const mintToken = async () => {
        const connection = contract.connect(signer);
        const addr = connection.address;
        const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
        });

        await result.wait();
        getMintedStatus();
        getCount();
    };

    async function getURI() {
        const uri = await contract.tokenURI(tokenId);
        console.log(uri)
    }

    return (
        <div>
            <img src={isMinted ? imageURI : require('../img/placeholder.png')} style={{ width: 400 }} />
            <div style={{ marginBottom: '2rem' }}>
                <h5>ID #{tokenId}</h5>
                {!isMinted ? (
                    <button onClick={mintToken}>
                        Mint
                    </button>
                ) : (
                    <button onClick={getURI}>
                        Taken! Show URI
                    </button>
                )}
            </div>
        </div>
    )
}

export default Home;
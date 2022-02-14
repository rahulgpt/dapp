import { useState } from "react";
import { ethers } from 'ethers';
import { useEffect } from "react";

const WalletBalance = ({ totalMinted }) => {
    const [balance, setBalance] = useState();

    useEffect(() => {
        getBalance()
    }, [totalMinted]);

    const getBalance = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
    }

    return (
        <div>
            <h5>Balance: {balance}</h5>
            <button onClick={() => getBalance()}>Get balance</button>
        </div>
    )
}

export default WalletBalance;
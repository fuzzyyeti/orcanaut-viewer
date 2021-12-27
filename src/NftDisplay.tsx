import React, {FC, useMemo, useCallback, useState, useEffect} from 'react';
import {ConnectionProvider, useWallet, WalletProvider, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import MintList from './mints_BPbS1AC4KW5SBiz8M2AgPtWXTzR1ekBwMLLQLcwdvZnE.json'
import hallowWhale from './collectible-assets/hallowhale.svg';
import porpoise from './collectible-assets/porpoise.svg';
import killerWhale from './collectible-assets/killer-whale.svg';
import starfish from './collectible-assets/starfish.svg';
import whale from './collectible-assets/whale.svg';
import clownfish from './collectible-assets/clownfish.svg';
import guppy from './collectible-assets/guppy.svg';
import axios from 'axios';
import classes from './NftDisplay.module.css';
import { makeStyles } from "@material-ui/core/styles";
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import {
    getParsedNftAccountsByOwner,
    getParsedAccountByMint
} from "@nfteyez/sol-rayz";
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl'
import {MenuItem} from "@mui/material";

const GUPPY = "guppyrZyEX9iTPSu92pi8T71Zka7xd6PrsTJrXRW6u1";
const CLOWNFISH = "cLownTTaiiQMoyMmFjfmSGowi8HyNhCtTLFcrNKnqX6";
const PORPOISE = "porpKs9ZZERXKkg55f1GRXCiXZK89Uz6VKS8Bv9qWqM";
const ADDRESS_WITH_LOTS_OF_TOKENS = "MNsTzWHjYx4ihWb5X7NPxwUzp3gntH8EFM6SsApvwPS";
const ANOTHER_ADDRESS_WITH_TOKENS = "DyDdJM9KVsvosfXbcHDp4pRpmbMHkRq3pcarBykPy4ir";
const ADDRESS_WITH_KILLER_WHALE = "4HZgK1cKRZSYZ4yzCiyBhD8frEVtmQH5x1qBwgiz6oJu";
const STARFISH = "star2pH7rVWscs743JGdCAL8Lc9nyJeqx7YQXkGUnWf";
const HALLOWHALE = "ha11o7FUziqRqpWLSnHoAnNjpeMYg6S3sSd7hfbqLyk";
const WHALE = "whaLeHav12EhGK19u6kKbLRwC9E1EATGnm6MWbBCcUW";
const KILLERWHALE = "kLwhLkZRt6CadPHRBsgfhRCKXX426WMBnhoGozTduvk";

const mapTokenAccounts = new Map();
mapTokenAccounts.set(GUPPY, guppy);
mapTokenAccounts.set(CLOWNFISH, clownfish,);
mapTokenAccounts.set(PORPOISE, porpoise);
mapTokenAccounts.set(STARFISH, starfish);
mapTokenAccounts.set(HALLOWHALE, hallowWhale);
mapTokenAccounts.set(WHALE, whale);
mapTokenAccounts.set(KILLERWHALE, killerWhale);


// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

interface TokenData {
    image: any,
    amount: number
}

const calcAmount = (value : number, decimals : number) => {
    if(decimals === 0) {
        return value;
    }
    return value/(10 ** decimals);
}

const TokenDisplay: FC = props => {
    const {publicKey} = useWallet();
    const { connection } = useConnection();
    const [collectiblesImg, setCollectiblesImg] = useState(new Array<TokenData>());
    const [collectibleHolder, setCollectibleHolder] = useState(ADDRESS_WITH_LOTS_OF_TOKENS);
    const handleChangeWallet = (e : any) => {
        setCollectiblesImg(new Array<TokenData>());
        console.log("selected key", e.target.value)
        setCollectibleHolder(e.target.value);
        console.log("updated state", collectibleHolder);
    }
    useEffect(() => {
        onConnect();

        }
    , [collectibleHolder]);

    const onConnect = useCallback(async () =>
    {
        console.log('key to retrieve', collectibleHolder);
        const mintAddresses = await connection.getParsedTokenAccountsByOwner( new PublicKey(collectibleHolder),
            {programId : new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")},
            "confirmed");
        console.log(mintAddresses);
        const collectibles = mintAddresses.value.filter(ma => mapTokenAccounts.has(ma.account.data.parsed.info.mint)).
            map(ma => setCollectiblesImg(prev => [...prev, { image: mapTokenAccounts.get(ma.account.data.parsed.info.mint), amount:
             calcAmount(parseInt(ma.account.data.parsed.info.tokenAmount.amount),parseInt(ma.account.data.parsed.info.tokenAmount.decimals))}]));
    }, [collectibleHolder]);
        let i = 0;  
    return (
        <div>
            <form>
                <FormControl>
                    <Select
                        MenuProps={{
                            sx: {
                                '& .MuiMenu-list': {
                                backgroundColor: '#404144',
                                    color: 'white'
                                }
                            }
                        }}
                        sx={{
                            backgroundColor: '#404144',
                            color: 'white',
                            fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', 'Helvetica, Arial, sans-serif'",
                            borderRadius: '6px'
                        }}
                        onChange={handleChangeWallet}
                        defaultValue={ADDRESS_WITH_LOTS_OF_TOKENS}
                    >
                    <MenuItem value={ADDRESS_WITH_LOTS_OF_TOKENS}>Wallet 0</MenuItem>
                    <MenuItem value={ADDRESS_WITH_KILLER_WHALE}>Wallet 1</MenuItem>
                        <MenuItem value={ANOTHER_ADDRESS_WITH_TOKENS}>Wallet 2</MenuItem>
                        {publicKey && (<MenuItem value={publicKey.toBase58()}>Your Address</MenuItem>)}
                </Select>
                </FormControl>
            </form>
            {collectiblesImg.map(td => (
                <div className={classes.sideBySide}>
                <img width={100} src={td.image}/>
                <p>Amount: {td.amount}</p>
                </div>
            ))}
        </div>
    );
}

export const NftDisplay: FC = () => {
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getTorusWallet({
            options: { clientId: 'Get a client ID @ https://developer.tor.us' }
        }),
        getLedgerWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network }),
    ], [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <TokenDisplay/>
                    <WalletMultiButton/>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";


// NOTE: This is a very early version of the database. I understand how this could make things kind of custodial? 
// I'm not sure if this is the best way to do this, but it's a start.

export interface WalletData {
    name: string;
    seedphrase: string;
    type: string;
    description: string;
    addresses: string[];
    [key: string]: any;
}

export interface WdkDataFile {
    wallets: {
        [walletId: string]: WalletData;
    };
    [key: string]: any;
}

class WdkDb {
    private db: Map<string, any> = new Map();
    private dataFilePath: string;
    private data: WdkDataFile;

    constructor(dataFilePath?: string) {
        this.db = new Map();
        // Default to wdk-data.json in the project root
        this.dataFilePath = dataFilePath || join(process.cwd(), "wdk-data.json");
        this.data = this.loadDataFile();
    }

    private loadDataFile(): WdkDataFile {
        if (existsSync(this.dataFilePath)) {
            try {
                const fileContent = readFileSync(this.dataFilePath, "utf-8");
                return JSON.parse(fileContent);
            } catch (error) {
                console.error("Error reading data file:", error);
                return this.getDefaultData();
            }
        }
        return this.getDefaultData();
    }

    private getDefaultData(): WdkDataFile {
        return {
            wallets: {}
        };
    }

    private saveDataFile(): void {
        try {
            writeFileSync(
                this.dataFilePath,
                JSON.stringify(this.data, null, 2),
                "utf-8"
            );
        } catch (error) {
            console.error("Error writing data file:", error);
            throw error;
        }
    }

    public initialize() {
        // Initialize the database, create data file if it doesn't exist
        if (!existsSync(this.dataFilePath)) {
            this.saveDataFile();
            console.log(`Created new data file at: ${this.dataFilePath}`);
        }
    }

    // Wallet-specific methods
    public setWallet(walletId: string, walletData: WalletData): void {
        if (!this.data.wallets) {
            this.data.wallets = {};
        }
        this.data.wallets[walletId] = walletData;
        this.saveDataFile();
    }

    public getWallet(walletId: string): WalletData | undefined {
        return this.data.wallets?.[walletId];
    }

    public getAllWallets(): { [walletId: string]: WalletData } {
        return this.data.wallets || {};
    }

    public deleteWallet(walletId: string): boolean {
        if (this.data.wallets?.[walletId]) {
            delete this.data.wallets[walletId];
            this.saveDataFile();
            return true;
        }
        return false;
    }

    // Generic key-value methods (backwards compatible)
    public set(key: string, value: any): void {
        this.db.set(key, value);
        // Also persist to data file
        this.data[key] = value;
        this.saveDataFile();
    }

    public get(key: string): any {
        // First check in-memory db, then data file
        if (this.db.has(key)) {
            return this.db.get(key);
        }
        return this.data[key];
    }

    public delete(key: string): boolean {
        const deleted = this.db.delete(key);
        if (this.data[key]) {
            delete this.data[key];
            this.saveDataFile();
            return true;
        }
        return deleted;
    }

    // Get the entire data object (useful for debugging)
    public getData(): WdkDataFile {
        return this.data;
    }
}

// Create and export a default instance
const db = new WdkDb();

export { db, WdkDb };
export default WdkDb;
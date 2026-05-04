import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

export const createTransactionGraph = async (txData) => {
    const session = driver.session({ database: process.env.NEO4J_DATABASE || 'neo4j' });
    try {
        const { from, to, value, hash, timestamp } = txData;
        
        // MERGE ensures we don't create duplicate nodes for the same wallet
        // SET allows updating node properties if needed
        const cypher = `
            MERGE (a:Wallet {address: $from})
            MERGE (b:Wallet {address: $to})
            MERGE (a)-[r:SENT {hash: $hash}]->(b)
            ON CREATE SET 
                r.value = $value,
                r.timestamp = $timestamp
            RETURN a, b, r
        `;

        const result = await session.run(cypher, {
            from: from.toLowerCase(),
            to: (to || 'Contract Creation').toLowerCase(),
            value: value.toString(),
            hash: hash,
            timestamp: neo4j.int(timestamp)
        });

        console.log(`✅ Graph relationship saved: ${from.substring(0, 10)}... → ${(to || 'Creation').substring(0, 10)}...`);
        return result;

    } catch (error) {
        console.error('❌ Neo4j Graph Error:', error);
    } finally {
        await session.close();
    }
};

export const getWalletGraph = async (address) => {
    const session = driver.session({ database: process.env.NEO4J_DATABASE || 'neo4j' });
    try {
        const cypher = `
            MATCH (w:Wallet {address: $address})-[r:SENT]-(neighbor:Wallet)
            RETURN w, r, neighbor
            LIMIT 50
        `;

        const result = await session.run(cypher, { address: address.toLowerCase() });
        
        return result.records.map(record => ({
            from: record.get('w').properties.address,
            to: record.get('neighbor').properties.address,
            relationship: record.get('r').type,
            metadata: record.get('r').properties
        }));

    } catch (error) {
        console.error('❌ Neo4j Retrieval Error:', error);
        throw error;
    } finally {
        await session.close();
    }
};

export const closeNeo4j = async () => {
    await driver.close();
};

export default driver;

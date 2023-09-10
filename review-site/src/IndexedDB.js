// class IndexedDB {
//     #database = null

//     constructor(dbName, storeName) {
//         const request = indexedDB.open(dbName, 3);

//         request.onupgradeneeded = e => {
//             const db = e.target.result;
//             if (!db.objectStoreNames.contains(storeName)) {
//                 db.createObjectStore(storeName, {keyPath: "id"})
//             }
//         }

//         request.onsuccess = e => {
//             console.log(e.target.result)
//             this.#database = e.target.result 
//             console.log(this.#database)
//         }

//         request.onerror = e => {
//             console.error("Error opening database", e.target.error)
//         }

        
//     }
    
//     getDatabase = () => {
//         return this.#database
//     }
    
//     addDataToIndexedDB = async (data, db, storeName) => {
//         const transaction = this.#database.transaction(storeName, "readwrite")
//         const store = transaction.objectStore(storeName)
    
//         const addRequest = store.add(data);
    
//         addRequest.onsuccess = e => {
//             console.log("Data added successfully")
//         }
    
//         addRequest.onerror = e => {
//             console.error("Error adding data", e.target.error)
//         }
//     }

//     getDataFromIndexedDB = (storeName) => {
//         const transaction = this.#database.transaction(storeName, "readonly")
//         const store = transaction.objectStore(storeName)
    
//         const getRequest = store.get(1)
    
//         getRequest.onsuccess = e => {
//             const retrievedData = e.target.result
//             console.log("Retrieved data:", retrievedData)
//             return retrievedData
//         }
    
//         getRequest.onerror = e => {
//             console.error("Error retrieving data", e.target.error)
//             return -1
//         }
//     }

//     updateDataInIndexedDB = (data, storeName) => {
//         const transaction = this.#database.transaction(storeName, "readonly")
//         const store = transaction.objectStore(storeName)
    
//         const updateRequest = store.put(data);
    
//         updateRequest.onsuccess = e => {
//             console.log("Data updated successfully");
//             return true
//         }
    
//         updateRequest.onsuccess = e => {
//             console.error("Error retrieving data", e.target.error);
//             return false
//         }
    
//     }
    
//     deleteStore = (storeName) => {
//         const transaction = this.#database.transaction(storeName, "readonly")
//         const store = transaction.objectStore(storeName)
    
//         const deleteRequest = store.delete(1);
    
//         deleteRequest.onsuccess = e => {
//             console.log("Data deleted successfully");
//         }
//     }

// }






// export default IndexedDB
class IndexedDB {
    #database = null;
    #dbReady = false;

    constructor(dbName, storeName) {
        const request = indexedDB.open(dbName, 3);

        request.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
        }
        };

        request.onsuccess = e => {
        this.#database = e.target.result;
        this.#dbReady = true;
        };

        request.onerror = e => {
        console.error("Error opening database", e.target.error);
        }
    }

    async waitForDBReady() {
        while (!this.#dbReady) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for DB to become ready
        }
    }

    addDataToIndexedDB = async (data, storeName) => {
        await this.waitForDBReady();

        const transaction = this.#database.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        try {
            console.log(data)
            await store.put(data);
            // console.log(data)
            console.log("Data added successfully");
        } catch (error) {
            console.error("Error adding data", error);
        }
    }

    getDataFromIndexedDB = async (storeName, key) => {
        await this.waitForDBReady();
        
        try {
            const transaction = this.#database.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);

            const getRequest = store.get(key);
            return new Promise((resolve, reject) => {
            getRequest.onsuccess = e => resolve(e.target.result);
            
            getRequest.onerror = e => reject(new Error("Error retrieving data", e.target.error));
        });
        } catch (error) {
            console.error("Error retrieving data", error);
            return -1;
        }
    }

    updateDataInIndexedDB = async (data, storeName) => {
        await this.waitForDBReady();

        const transaction = this.#database.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        try {
        await store.put(data);
        console.log("Data updated successfully");
        return true;
        } catch (error) {
        console.error("Error updating data", error);
        return false;
        }
    }

    deleteStore = async (storeName) => {
        await this.waitForDBReady();

        const transaction = this.#database.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        try {
        await store.clear();
        console.log("Store cleared successfully");
        } catch (error) {
        console.error("Error clearing store", error);
        }
    }
}

export default IndexedDB;

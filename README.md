# Content Verification Sidechain

This project was bootstrapped with [Klayr SDK](https://github.com/Klayrhq/klayr-sdk)
This project implements a basic sidechain for content verification using the Klayr SDK. It allows users to submit content, verify it, and build reputation based on their submissions.

## Project Overview
### The Content Verification Sidechain is designed to:

- Allow users to submit content for verification
- Store submitted content securely
- Track user reputation based on their submissions
- Provide statistics on overall content submissions and verifications

## Key Components

- ContentVerifierModule: The main module that orchestrates the content verification process.
- ContentStore: Stores submitted content entries.
- StatsStore: Keeps track of global statistics for content submissions and verifications.
- UserReputationStore: Manages user reputation data.
- CreateContentCommand: Handles the creation and storage of new content entries.
- ContentVerifierMethod: Implements methods for retrieving content, stats, and user reputation.
- ContentVerifierEndpoint: Exposes API endpoints for interacting with the sidechain.

## Setup and Installation

### Ensure you have Node.js and npm installed.
### Clone the repository
```
git clone [repository-url]
```
### Install dependencies
```
npm install
```
### Build the project
```
npm run build
```

## Running the Sidechain
### Start a node

```
./bin/run start --config=config/custom_config.json
```

### The node will be available by default at
```
http://localhost:7887
```

## Interacting with the Sidechain
### Here are some example commands to interact with the sidechain:

### Create content
```
./bin/run transaction:create contentVerifier createContent 10000000 --params='{"hash":"QmX4n5qKvqrA1JQFYqsdqhULtVXF6YHiH3CfDFX1YcBxEn", "userId":"user123", "timestamp":1633036800}' --json --pretty
```

### Send the created transaction

```
./bin/run transaction:send <binary_transaction_output>
```

### Get content

```
curl -X POST -H "Content-Type: application/json" -d @./test/api/getContent.json http://localhost:7887/rpc
```

### Get stats

```
curl -X POST -H "Content-Type: application/json" -d @./test/api/getStats.json http://localhost:7887/rpc
```

### Get user reputation

```
curl -X POST -H "Content-Type: application/json" -d @./test/api/getReputation.json http://localhost:7887/rpc
```

## Future Improvements

- Implement content verification logic
- Add more robust error handling and input validation
- Implement a proper consensus mechanism for block creation
- Add comprehensive testing
- Implement proper key management and user authentication

## License
This project is licensed under the Apache License 2.0.

## Discord Username
- pope_h
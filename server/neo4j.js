let neo4j = require('neo4j-driver').v1;

let graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
let graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
let graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;

let driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));

var session = driver.session();
session
    .run("CREATE (n {hello: 'World'}) RETURN n.name")
    .then(function(result) {
        result.records.forEach(function(record) {
            console.log(record)
        });

        session.close();
    })
    .catch(function(error) {
        console.log(error);
    });

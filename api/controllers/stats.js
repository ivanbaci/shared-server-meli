const request = require("request");

const host = "http://app-server-meli.herokuapp.com/stats/";

exports.getUsers = (req, res) => {
    let finalUri = host + "users";
    request(
        {
            uri: finalUri,
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        },
        function(error, response, body) {
            console.log(response.statusCode);
            console.log(body);
            if (response.statusCode == 200) {
                res.status(200).json(body);
            } else {
                res.status(500).json(error);
            }
        }
    );
};

exports.getProducts = (req, res) => {
    let finalUri = host + "products";
    request(
        {
            uri: finalUri,
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        },
        function(error, response, body) {
            console.log(response.statusCode);
            console.log(body);
            if (response.statusCode == 200) {
                res.status(200).json(body);
            } else {
                res.status(500).json(body);
            }
        }
    );
};

exports.getSales = (req, res) => {
    let finalUri = host + "sales";
    request(
        {
            uri: finalUri,
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        },
        function(error, response, body) {
            if (response.statusCode == 200) {
                res.status(200).json(body);
            } else {
                res.status(500).json(body);
            }
        }
    );
};

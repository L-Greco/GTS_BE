const badRequestHandler = function (error, req, res, next) {


    if (error.status === 400) {

        res.status(400).send(error.message);
    } else {
        next(error);
    }



};

const unAuthorizedHandler = function (error, req, res, next) {

    if (error.status === 401) {
        res.status(401).send(error.message || "Unauthorized");
    } else {
        next(error);
    }



};

const forBiddenHandler = function (error, req, res, next) {
    try {
        if (error.status === 403) {
            res.status(403).send(error.message || "Forbidden");
        } else {
            next(error);
        }
    } catch (error) {
        next(error);
    }
};

const notFoundHandler = function (error, req, res, next) {

    if (error.status === 404) {
        res.status(404).send(error.message || "Not Found");
    } else {
        next(error);
    }

};

const catchAllHandler = function (error, req, res, next) {
    console.log(error)

    res.status(500).send(error);
};


export default [badRequestHandler, unAuthorizedHandler, forBiddenHandler, notFoundHandler, catchAllHandler]
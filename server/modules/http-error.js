class HttpError extends Error{
    constructor(status, message) {
        this.id = status;
        this.message = message;
    }

    static processError(err, res){
        console.log(err.message);
        if(!err.status){ err.status = 500; }
        const json = { error: err.message };
        res.status(err.status).json(json);
    }
}

module.exports = HttpError;
class ExpressError extends Error{
    constructor(StatusCode, Message){
        super();
        this.StatusCode = StatusCode;
        this.Message = Message;
    }
}

module.exports = ExpressError;
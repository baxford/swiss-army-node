/**
 * This file contains a map of errors.
*/

function APIError(err, code, message, detail) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'APIError';
    // allow for multiple clientErrors, eg in the case of validation errors.
    this.message = message;
    this.code = code;
    this.detail = detail;
}
APIError.prototype.__proto__ = Error.prototype;
APIError.prototype.name = 'APIError';
APIError.prototype.constructor = APIError;
/**
 * Return an error and populate fields on the error as needed.
 */
module.exports = function(errorTable) {
    this.errorTable = errorTable;
    function getMessageByErrorCode(code) {
        var msg = errorTable[code];
        if (!msg) {
            msg = 'Unknown Error';
        }
        return msg;
    }
    return {
        errorByCode : function(err, code, detail) {
            if (err instanceof APIError) {
                // it's already an APIError, so don't bother converting it.
                return err;
            } else {
                var message = getMessageByErrorCode(code);
                var error = new APIError(err, code, message, detail);
                return error;
            }
        }
    };
};

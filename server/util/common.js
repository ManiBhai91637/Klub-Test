
import Errors from './errors' 
import errors from './errors';

class Common {

	constructor() {

	}

	handleError(errorType, error, array) {
	  return array.push({
	    code: errors[errorType][error].code,
	    message: errors[errorType][error].msg
	  });
	}

}

export default new Common();
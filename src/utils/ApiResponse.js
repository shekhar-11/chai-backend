class ApiResponse 
{
  constructor(statusCode,data,message="Success")
  {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode<400
  }
}

export {ApiResponse}

//// Just for the standardized API response format with status, data, message, and success flag.

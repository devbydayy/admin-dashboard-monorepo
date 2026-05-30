

class ApiResponse {
  constructor(data, statusCode = 200, success = true) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success(data, statusCode = 200) {
    return new ApiResponse(data, statusCode, true);
  }

  static created(data) {
    return new ApiResponse(data, 201, true);
  }

  static error(message, statusCode = 500) {
    return new ApiResponse({ message }, statusCode, false);
  }

  static paginated(data, pagination) {
    return new ApiResponse(
      { items: data, pagination },
      200,
      true
    );
  }
}

module.exports = { ApiResponse };

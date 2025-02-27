const HTTP_STATUS = {
  OK: 200, // request was successful
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401, // authentication failed or
  // user doesn't have permissions for requested operation.
  FORBIDDEN: 403, // access denied
  NOT_FOUND: 404, // resource was not found.
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422, // requested data contain invalid values.
  INTERNAL_SERVER_ERROR: 500,
};

export default HTTP_STATUS;

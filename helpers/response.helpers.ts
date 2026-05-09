export const success = <T>(data: T, message = "OK", statusCode = 200) => {
  return Response.json(
    {
      data,
      error: null,
      message,
      statusCode,
    },
    { status: statusCode },
  );
};

export const error = (message = "Error", statusCode = 400) => {
  return Response.json(
    {
      data: null,
      error: message,
      message,
      statusCode,
    },
    { status: statusCode },
  );
};

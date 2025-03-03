// apiResponse.js
export const successResponse = (
  res,
  data,
  message = "Success",
  status = 200
) => {
  res.status(status).json({
    success: true,
    status,
    message,
    data,
  });
};

export const errorResponse = (res, message = "Error", status = 400) => {
  res.status(status).json({
    success: false,
    status,
    message,
  });
};

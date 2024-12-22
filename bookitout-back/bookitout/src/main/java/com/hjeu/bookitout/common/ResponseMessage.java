package com.hjeu.bookitout.common;

public interface ResponseMessage {

    // HTTP Status 200
    String SUCCESS = "Success.";

    // HTTP Status 400
    String VALIDATION_FAILED = "Validation Failed.";
    String DUPLICATE_ID = "Duplicate id.";
    String DUPLICATE_NICKNAME = "Duplicate nickname.";
    String NOT_EXISTED_USER = "This user does not exist.";
    String NOT_EXISTED_FAVORITE = "This favorite does not exist.";

    // HTTP Status 401
    String SIGN_IN_FAIL = "Login information missmatch.";
    String AUTHORIZATION_FAIL = "Authorization Failed.";

    // HTTP Status 403
    String NO_PERMISSION = "Do not have permission.";

    // HTTP Status 500
    String DATABASE_ERROR = "Database error.";
}

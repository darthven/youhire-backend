/**
 * @swagger
 *  '/api/user/send':
 *       post:
 *           tags:
 *               - users
 *           summary: Send message to the user's phone number for signing in or registration.
 *           operationId: sendMessage
 *           requestBody:
 *               description: Mobile phone number of user for signing in or registration.
 *               content:
 *                   application/json:
 *                       schema:
 *                       type: object
 *                       required:
 *                           - phoneNumber
 *                       properties:
 *                           phoneNumber:
 *                           type: string
 *                           format: phoneNumber
 *                           example: '+380933456784'
 *       responses:
 *           '201':
 *               description: Successful result of sending SMS.
 *               content:
 *                   application/json:
 *                   schema:
 *                       type: object
 *                       properties:
 *                          message:
 *                              type: string
 *                              format: alpha
 *                               example: 'SMS was sent successfully'
 *           '400':
 *               description: Result of invalid parameters in the request body.
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/definitions/ValidationErrorResponse'
 *          '402':
 *               description: 'Previous verification code was sent less then 30 seconds ago.'
 *                   content:
 *                       application/json:
 *                           schema:
 *                               type: object
 *                               properties:
 *                               status:
 *                                   type: integer
 *                                   example: 402
 *                               message:
 *                                   type: string
 *                                   format: alphanumeric
 *                                   example: 'Previous SMS was sent less then 30 sec ago.'
 *  '/api/user/auth/{type}':
 *       post:
 *           tags:
 *               - users
 *           parameters:
 *               - name: type
 *               in: path
 *               description: Role of user in application
 *               required: true
 *               schema:
 *                   type: string
 *                   format: alpha
 *                   enum: ['earner', 'spender']
 *           summary: Sign in or register user via verification code sent by SMS.
 *           operationId: authentificateUser
 *           requestBody:
 *               description: Mobile phone number of user, verification code, which was sent in SMS.
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           required:
 *                               - phoneNumber
 *                               - code
 *                           properties:
 *                               phoneNumber:
 *                                   type: string
 *                                   format: phoneNumber
 *                                   example: '+380933456784'
 *                               code:
 *                                   type: integer
 *                                   example: 34457
 *           responses:
 *               '201':
 *                  description: Verification code is valid, user is signed in.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/ProfileSignInResponse'
 *               '400':
 *                  description: Some request parameters are wrong or missed.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/ValidationErrorResponse'
 *               '402':
 *                  description: Phone number was not found in system.
 *                               User should register first using /api/user/send url.
 *                   content:
 *                       application/json:
 *                           schema:
 *                               type: object
 *                               required:
 *                               - status
 *                               - message
 *                               properties:
 *                                  status:
 *                                       type: integer
 *                                       example: 402
 *                                   message:
 *                                       type: string
 *                                       format: alpha
 *                                       example: 'Phone number is not registered'
 *               '403':
 *                   description: SMS verification code is wrong.
 *                   content:
 *                      application/json:
 *                           schema:
 *                               type: object
 *                               required:
 *                               - status
 *                               - message
 *                               properties:
 *                                   status:
 *                                       type: integer
 *                                       example: 403
 *                                   message:
 *                                       type: string
 *                                       format: alphanumeric
 *                                       example: 'Invalid verification code'
 *               '404':
 *                  description: 'Role is not supported by system.'
 *                   content:
 *                       application/json:
 *                           schema:
 *                               type: object
 *                               properties:
 *                                   status:
 *                                       type: integer
 *                                       example: 404
 *                                   message:
 *                                       type: string
 *                                       example: 'Role {type} is not supported'
 *  '/api/user/profile':
 *       put:
 *           tags:
 *               - registered users
 *           summary: Update user's profile
 *           operationId: createUser
 *           requestBody:
 *              description: User data passed according to application.
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/definitions/UserData'
 *           responses:
 *               '200':
 *                   description: User has been registered.
 *                   content:
 *                       application/json:
 *                           schema:
 *                               $ref: "#/definitions/Profile"
 *               '401':
 *                   description: Earners's session does not exist.
 *                   content:
 *                      application/json:
 *                          schema:
 *                               $ref: '#/definitions/UnauthorizedResponse'
 *       get:
 *           tags:
 *               - registered users
 *           summary: Get user's profile
 *           operationId: userProfile
 *           responses:
 *               '200':
 *              description: Earner's token is valid.
 *               content:
 *                   application/json:
 *                       schema:
 *                          type: object
 *                          required:
 *                              - id
 *                              - type
 *                               - info
 *                           properties:
 *                               id:
 *                                   type: integer
 *                                   example: 1
 *                               type:
 *                                   type: string
 *                                   format: alpha
 *                                   enum: ['earner', 'spender']
 *                               info:
 *                                   $ref: "#/definitions/Profile"
 *               '401':
 *                   description: Earners's session does not exist.
 *                   content:
 *                       application/json:
 *                           schema:
 *                               $ref: '#/definitions/UnauthorizedResponse'
 *   definitions:
 *       Category:
 *     required:
 *       - id
 *       - name
 *     properties:
 *       name:
 *         type: string
 *         format: alpha
 *         example: 'Cleaning'
 *       subcategories:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Subcategory'
 *       strictSubcategories:
 *         type: array
 *         items:
 *           $ref: '#/definitions/StrictSubcategory'
 *   Subcategory:
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *         format: alpha
 *         example: 'House cleaning'
 *   StrictSubcategory:
 *     required:
 *       - name
 *       - certificate
 *     properties:
 *       name:
 *         type: string
 *         format: alpha
 *         example: 'Office cleaning'
 *       certificate:
 *         type: string
 *         format: alphanumeric
 *         example: 'Office cleaning certificate ES3213'
 *   UserData:
 *     required:
 *       - phoneNumber
 *       - firstName
 *       - lastName
 *       - birthDate
 *       - gender
 *       - email
 *       - photo
 *     properties:
 *       phoneNumber:
 *         type: string
 *         format: phoneNumber
 *         example: '+380933456784'
 *       firstName:
 *         type: string
 *         format: alpha
 *         example: 'Adam'
 *       lastName:
 *         type: string
 *         format: alpha
 *         example: 'Jansen'
 *       birthDate:
 *         type: string
 *         format: date
 *         example: '7/23/1978'
 *       gender:
 *         type: string
 *         format: alpha
 *         example: 'male'
 *       email:
 *         type: string
 *         format: email
 *         example: 'adamjansen@gmail.com'
 *       photo:
 *         type: string
 *         format: base64
 *         example: 'data:image/jpeg;base64,R0lGODlhPQBEAPeoAJosM//AwO/AwHVYZ/z595kzA=='
 *       category:
 *             $ref: '#/definitions/Category'
 *   Profile:
 *     required:
 *       - id
 *       - type
 *       - info
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       type:
 *         type: string
 *         format: alpha
 *         example: 'earner'
 *       info:
 *         $ref: '#/definitions/UserData'
 *   ProfileSignInResponse:
 *     type: object
 *     required:
 *       - status
 *       - token
 *       - profile
 *     properties:
 *       status:
 *         type: string
 *         format: alpha
 *         example: 'Success'
 *       token:
 *         type: string
 *         format: hash
 *         example: 'cXO2WoUsNK4aAPA91bHnpbaBw2S8IdAijP3NiLRfN2u0ukbSlq6lQ8dyuAOwCAeNlUH5qR2kRqIgyuUd0vQCwRlXc'
 *       profile:
 *         $ref: '#/components/schemas/Profile'
 *   ValidationErrorResponse:
 *     type: object
 *     required:
 *       - status
 *       - message
 *     properties:
 *       status:
 *         type: integer
 *         example: 400
 *       message:
 *         type: string
 *         format: alpha
 *         example: 'Validation error'
 *       payload:
 *         type: string
 *         format: alphanumeric
 *         example: 'Value 1 has incorrect length'
 *   UnauthorizedResponse:
 *     type: object
 *     required:
 *       - status
 *       - message
 *     properties:
 *       status:
 *         type: integer
 *         example: 401
 *       message:
 *         type: string
 *         format: alpha
 *         example: 'Unauthorized'
 */
// tslint:disable-next-line:no-empty-interface
export default interface SwaggerDocumentation {

}

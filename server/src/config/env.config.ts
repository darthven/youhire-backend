export default {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
    SMS_APP_HOST: process.env.SMS_APP_HOST || "localhost",
    SMS_APP_PORT: process.env.SMS_APP_PORT || 2080,
    SMS_TEXT: process.env.SMS_TEXT || "{{ code }} - YOUHIRE confirmation code",
    CODE_LEN: process.env.CODE_LEN || 6,
    CODE_PERIOD: process.env.CODE_PERIOD || 5
}

export default {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
    SMS_APP_HOST: process.env.SMS_APP_HOST || "localhost",
    SMS_APP_PORT: process.env.SMS_APP_PORT || 2080,
    SMS_TEXT: process.env.SMS_TEXT || "{{ code }} - YOUHIRE confirmation code",
    CODE_LEN: process.env.CODE_LEN || 6,
    CODE_PERIOD: process.env.CODE_PERIOD || 5,
    JWT_SECRET: process.env.JWT_SECRET || "1234567890",
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyDej5NrA2yP_kJCz1IHc_N0qFV6nyZjz8Q",
    STRIPE_API_KEY: process.env.STRIPE_API_KEY || "sk_test_dwHcFtAgdpwyMM3iprU5YCbJ"
}

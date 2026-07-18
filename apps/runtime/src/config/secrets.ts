export const secrets = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnon: process.env.SUPABASE_ANON_KEY,
  supabaseService: process.env.SUPABASE_SERVICE_ROLE_KEY,

  twilioSid: process.env.TWILIO_SID,
  twilioAuth: process.env.TWILIO_AUTH,
  twilioFrom: process.env.TWILIO_FROM,

  groq: process.env.GROQ_API_KEY,
  deepseek: process.env.DEEPSEEK_API_KEY,

  firebase: process.env.FIREBASE_SECRET,
  mongo: process.env.MONGO_URI,
  redis: process.env.REDIS_URL,

  google: process.env.GOOGLE_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
  openai: process.env.OPENAI_API_KEY,
  huggingface: process.env.HF_API_KEY,

  custom1: process.env.CUSTOM_API_KEY_1,
  custom2: process.env.CUSTOM_API_KEY_2,
  custom3: process.env.CUSTOM_API_KEY_3,
  custom4: process.env.CUSTOM_API_KEY_4,
  custom5: process.env.CUSTOM_API_KEY_5,
};
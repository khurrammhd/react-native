//API Base URL
export const API_URL = 'https://geminipanel.myadtechglobal.com/api/V1'; // live
import {showMessage, hideMessage} from 'react-native-flash-message';
export const Base_URL = 'https://geminipanel.myadtechglobal.com'; // live

export const showErrorMessage = message => {
  showMessage({
    message: message,
    type: 'error',
    backgroundColor: '#FF7F7F',
  });
};

export const showSuccessMessage = message => {
  showMessage({
    message: message,
    type: 'success',
    backgroundColor: '#90EE90',
  });
};

//API End Points
export const api = {
  //Common
};

export const colors = {
  primary_color: '#F67A08',
  secondary_color: '#132E5B',
  accent_color: '#505050',
  drawer_color: 'rgba(0, 253, 253, 0.6)',
  bg_color: '#EFF0F1',
  main_bg_color: '#E5E5E5',
  loadingBG_color: 'rgba(0, 0, 0, 0.1)',
  border_color: '#CDCDCD',
  title_color: '#000000',
  text_color: 'grey',
  sub_text_color: 'grey',
  card_color: '#f2f2f2',
  card_border_color: '#ccd7e0',
  textInput_bgColor: 'white',
  white_color: '#ffffff',
  dark_green: '#9FAF24',
  grey_primary: '#BEBEBE',
  grey_secondary: '#CDCDCD',
  light_grey: '#ECF4F4',
  date_orange: '#FF9900',
};

// social_type (1-facebook, 2-google, 3-Apple)
export const social_type = {
  FACEBOOK: 1,
  GOOGLE: 2,
  APPLE: 3,
};

export const fonts = {
  light: 'Metropolis-Light',
  regular: 'Metropolis-Regular',
  bold: 'Metropolis-Bold',
  semibold: 'Metropolis-SemiBold',
  medium: 'Metropolis-Medium',
};

export const config = {
  showTextInputIcons: false,
  paperTheme: true,
  EMAIL_REG: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  currency: '$',

  // stripe_instruction:

  // stripe test credentials
  stripe_api_key:
    'pk_test_51KOcMRKRyIkZ6DBeg5xxzYwtF1L7GUJqpuKZAakyOeRKjjUKKHWDXnztovYMFV1fEsAg26kxWHc8K1P4HK6xwhkg00Nnxqroia',
  stripe_secret_key:
    'sk_test_51KOcMRKRyIkZ6DBeLB08JgK0vqsqbgl89Qa6e0mq2hsWWVrdzKGkAorKFKNZK3J2fel3pMWR87PxyCKD2BJz4ixY00mvyq0CR0',
};
// In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.
export default {
  colors,
  config,
  social_type,
  fonts,
};

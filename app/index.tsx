import { Redirect } from 'expo-router';

// Faylkani shaqadiisa kaliya waa inuu si sax ah ugu hago app-ka bogga ugu horeeya.
// Wax cilad ah kama imaan karto, waana nadiif yahay.
export default function Index() {
  return <Redirect href="/home" />;
}
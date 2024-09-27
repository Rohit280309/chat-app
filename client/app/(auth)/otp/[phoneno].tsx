import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/components/useColorScheme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from "@/api/axios";
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';
import { useNotification } from '@/context/NotificationContext';

const Otp = () => {
  const colorScheme = useColorScheme();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(300);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const router = useRouter();
  const { phoneno } = useLocalSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const { showNotification } = useNotification();


  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index]) {
        handleChange('', index);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = () => {
    if (otp.join('').length !== 6) {
      setErr(true);
      showNotification("Please enter the otp", "error");
      return;
    }
    setLoading(true);
    axios.post("/verify-otp", { otp: otp.join(''), phoneNo: phoneno })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          login(res.data.token);
          router.push("/");
        }
      })
      .catch((err) => {
        showNotification("Invalid OTP", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleResend = () => {
    setLoading(true);
    axios.post("/resend-otp", { phoneNo: phoneno })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          setOtp(Array(6).fill(''));
          setTimer(300);
          inputRefs.current[0]?.focus();
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView className='h-screen'>
      <View className='h-full flex justify-center items-center'>
        <Text className={`font-semibold text-xl ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}>
          Enter OTP
        </Text>
        <View className="flex-row justify-center mt-4">
          {otp.map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className={`border ${err ? "border-red-600" : "border-gray-400"}  rounded-lg text-center mx-1 ${colorScheme === 'light' ? 'text-black' : 'text-white'
                }`}
              style={{ width: 40, height: 50 }}
              keyboardType="numeric"
              maxLength={1}
              value={otp[index]}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setErr(false)}
            />
          ))}
        </View>
        <View className='flex justify-center items-center'>
          {/* <TouchableOpacity className='flex items-center justify-center bg-blue-500 w-32 h-12 mt-5 rounded-lg' disabled={loading} onPress={handleSubmit}>
            <Text className={`text-lg text-center align-middle font-semibold  ${colorScheme === "light" ? "text-black" : "text-white"}`}>
              {loading ? <Spinner size={20} color={colorScheme === "light" ? "black" : "white"} /> : "Verify"}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            className='flex items-center justify-center'
            disabled={loading}
            onPress={handleSubmit}
          >
            {loading ? (
              <View className='flex items-center justify-center bg-blue-500 w-32 h-12 mt-5 rounded-lg'>
                <Spinner size={20} color={colorScheme === "light" ? "black" : "white"} />
              </View>
            ) : (
              <Text className={`bg-blue-500 w-32 h-12 mt-5 rounded-lg text-lg text-center align-middle font-semibold ${colorScheme === "light" ? "text-black" : "text-white"}`}>
                Verify
              </Text>
            )}
          </TouchableOpacity>

        </View>
        <Text
          className={`mt-4 text-lg ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}
        >
          Time Remaining: {formatTime(timer)}
        </Text>
        {timer === 0 && (
          <TouchableOpacity
            className="mt-2 bg-red-500 p-3 rounded-lg"
            onPress={handleResend}
            disabled={loading}
          >
            {
              loading ? (

                <Spinner size={15} />
              ) : (
                <Text className="text-white font-semibold">Resend OTP</Text>
              )
            }
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Otp;

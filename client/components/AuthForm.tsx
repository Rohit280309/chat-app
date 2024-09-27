import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Logo from "@/assets/images/fav.png";
import { useColorScheme } from './useColorScheme';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import RNPickerSelect from 'react-native-picker-select';
import { Link, useRouter, Href } from 'expo-router';
import { useNotification } from '@/context/NotificationContext';
import axios from "@/api/axios";

interface AuthFormTypes {
  type: "login" | "signup" | "resetPassword";
}

const AuthForm = ({ type }: AuthFormTypes) => {
  const colorScheme = useColorScheme();
  const [borderColor, setBorderColor] = useState<string>("border-gray-600");

  const { showNotification } = useNotification();

  const router = useRouter();

  const formSchema = z.object({
    firstname: type === "signup" ? z.string().min(1, "Name is required") : z.string().optional(),
    lastname: z.string().optional(),
    email: type === "signup" ? z.string().email("Enter a valid email") : z.string().optional(),
    countryCode: z.string().min(3, "Country code is required"),
    phoneno: z.string().min(10, "Please enter a valid phone no"),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, { message: "Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character." }),
    confirmPassword: type === "resetPassword" ? z.string().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, { message: "Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character." }) : z.string().optional()
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    
    if (type === "login") {
      axios.post("/login", {
        phoneNo: data.countryCode + data.phoneno,
        password: data.password
      }).then((res) => {
        if (res.data.success) {
          console.log("Otp: ",res.data.otp);
          showNotification("Login Successfull :)", "success");
          const phoneno = data.countryCode+data.phoneno;
          router.push(`/otp/${phoneno}` as Href<`/otp/${string}`>);
        }
      }).catch(err => showNotification("Login Failed", "error"));
    }

  };

  const countryCodes = [
    { label: "+1", value: "+1" },
    { label: "+44", value: "+44" },
    { label: "+91", value: "+91" },
  ];

  return (
    <View className='h-full flex items-center justify-center gap-3'>
      <Image
        source={Logo}
        className='w-36 h-36 rounded-full'
      />

      {type === "signup" &&
        <>
          {/* <Text className={`${colorScheme === "light" ? "text-black" : "text-white"}`}>Firstname</Text> */}
          <TextInput
            className={`ml-2 w-5/6 p-2 rounded-lg border ${errors.email?.message ? "border-red-600" : borderColor} ${colorScheme === "light" ? "text-black" : "text-white"}`}
            placeholder="Firstname"
            placeholderTextColor={`${colorScheme === "light" ? "#74777F" : "white"}`}
            onChangeText={(text) => {
              setBorderColor("border-gray-600");
              setValue('firstname', text);
            }}
            {...register('firstname')}
          />
          {errors.email && <Text className='text-red-500'>{errors.email.message}</Text>}

          {/* <Text className={`${colorScheme === "light" ? "text-black" : "text-white"}`}>Lastname</Text> */}
          <TextInput
            className={`ml-2 w-5/6 p-2 rounded-lg border ${errors.email?.message ? "border-red-600" : borderColor} ${colorScheme === "light" ? "text-black" : "text-white"}`}
            placeholder="Lastname"
            placeholderTextColor={`${colorScheme === "light" ? "#74777F" : "white"}`}
            onChangeText={(text) => {
              setBorderColor("border-gray-600");
              setValue('lastname', text);
            }}
            {...register('lastname')}
          />
          {errors.email && <Text className='text-red-500'>{errors.email.message}</Text>}

          {/* <Text className={`${colorScheme === "light" ? "text-black" : "text-white"}`}>Email</Text> */}
          <TextInput
            className={`ml-2 w-5/6 p-2 rounded-lg border ${errors.email?.message ? "border-red-600" : borderColor} ${colorScheme === "light" ? "text-black" : "text-white"}`}
            placeholder="Email"
            placeholderTextColor={`${colorScheme === "light" ? "#74777F" : "white"}`}
            onChangeText={(text) => {
              setBorderColor("border-gray-600");
              setValue('email', text);
            }}
            {...register('email')}
          />
          {errors.email && <Text className='text-red-500'>{errors.email.message}</Text>}
        </>
      }

      {/* <Text className={`${colorScheme === "light" ? "text-black" : "text-white"}`}>Phone no</Text> */}
      <View className='flex-row items-center w-5/6 p-2 gap-2'>
        <View className={`w-1/5 -ml-1 border ${errors.password?.message ? "border-red-600" : borderColor} rounded-lg`}>
          <RNPickerSelect
            onValueChange={(value) => {
              setValue('countryCode', value);
              setBorderColor("border-gray-600");
            }}
            items={countryCodes}
            style={{
              inputIOS: {
                color: colorScheme === "light" ? "black" : "white",
                borderColor: errors.countryCode?.message ? "red" : "gray",
                // borderWidth: 1,
                // borderRadius: 4,
                padding: 7,
              },
              inputAndroid: {
                color: colorScheme === "light" ? "black" : "white",
                borderColor: errors.countryCode?.message ? "red" : "gray",
                // borderWidth: 1,
                // borderRadius: 4,
                padding: 7,
              },
            }}
            useNativeAndroidPickerStyle={false}
            placeholder={{ label: "Code", value: "+91" }}
          />
          {errors.countryCode?.message && <Text className='text-red-500'>{errors.countryCode.message}</Text>}
        </View>
        <View className='w-4/5 ml-2'>
          <TextInput
            className={`p-2 rounded-lg border ${errors.phoneno?.message ? "border-red-600" : borderColor} ${colorScheme === "light" ? "text-black" : "text-white"}`}
            placeholder="Phone no"
            keyboardType='numeric'
            placeholderTextColor={`${colorScheme === "light" ? "#74777F" : "white"}`}
            onChangeText={(text) => {
              setBorderColor("border-gray-600");
              setValue('phoneno', text);
            }}
            {...register('phoneno')}
          />
          {/* {errors.phoneno?.message && <Text className='text-red-500'>{errors.phoneno.message}</Text>} */}
        </View>
      </View>

      {/* <Text className={`${colorScheme === "light" ? "text-black" : "text-white"}`}>Password</Text> */}
      <TextInput
        className={`ml-2 w-5/6 p-2 rounded-lg border ${errors.password?.message ? "border-red-600" : borderColor} ${colorScheme === "light" ? "text-black" : "text-white"}`}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={`${colorScheme === "light" ? "#74777F" : "white"}`}
        onChangeText={(text) => {
          setBorderColor("border-gray-600");
          setValue('password', text);
        }}
        {...register('password')}
      />
      {errors.password && <Text className='text-red-500'>{errors.password.message}</Text>}

      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text className={`rounded-lg text-center align-middle text-lg font-semibold bg-blue-500 w-32 h-12 mt-5 ${colorScheme === "light" ? "text-black" : "text-white"}`}>Submit</Text>
      </TouchableOpacity>

      {
        (type === "login" || type === "signup") &&
        <View className='flex-row justify-center items-center p-4'>
          <Text className={`font-semibold ${colorScheme === "light" ? "text-black" : "text-white"}`}>{`${type === "login" ? "Don't have an account? " : "Already have an account? "}`}</Text>
          <Link className='text-blue-500 font-semibold' href={`${type === "login" ? "/signup" : "/login"}`}>{`${type === "login" ? "Signup" : "Login"}`}</Link>
        </View>
      }
    </View>
  );
};

export default AuthForm;

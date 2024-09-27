import twilio from 'twilio';

interface OtpArgs {
    phoneNo: string,
}

export const sendOtp = async ({ phoneNo }: OtpArgs) => {
    try {
        const generateOtp = () => {
            return Math.floor(100000 + Math.random() * 900000);
        }
        const accountSid = process.env.TWILIO_ACCOUNT_SID!;
        const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN!;
        const twilioPhoneNo = process.env.TWILIO_PHONENO!;

        // Temporary commented to save twilio credits

        // const client = twilio(accountSid, twilioAuthToken);

        // const message = await client.messages.create({
        //     body: generateOtp().toString(),
        //     from: twilioPhoneNo,
        //     to: phoneNo,
        // });

        const otp = generateOtp();

        return { success: true, otp: otp }

    } catch (error: any) {
        throw new Error(error.message);
    }
}
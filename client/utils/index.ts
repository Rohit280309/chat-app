import { Audio } from 'expo-av';

export const formatString = (s: string, n: number) => {
    if (s.length > n) {
        return s.substring(0, n) + "...";
    }
    return s;
}

export const colorList = [
    'red-500',
    'blue-500',
    'green-500',
    'yellow-500',
    'purple-500',
];

export function getColor(index: number) {
    return colorList[index % colorList.length];
}

export function formatDate(inputDate: string): string {
    // Create a date object in UTC
    const date = new Date(inputDate);
  
    // Convert to Indian Standard Time (IST)
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30 in milliseconds
    const dateIST = new Date(date.getTime() + IST_OFFSET);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    // Convert these to IST
    const todayIST = new Date(today.getTime() + IST_OFFSET);
    const yesterdayIST = new Date(todayIST.getTime() - 24 * 60 * 60 * 1000); // 24 hours before today

    const isToday = dateIST >= todayIST;
    const isYesterday = dateIST >= yesterdayIST && dateIST < todayIST;
  
    if (isToday) {
        // Return time in AM/PM format
        let hours = dateIST.getHours();
        const minutes = dateIST.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
        return `${hours}:${minutesStr} ${ampm}`;
    } else if (isYesterday) {
        return 'Yesterday';
    } else {
        // Return date in YYYY-MM-DD format
        const year = dateIST.getFullYear();
        const month = ('0' + (dateIST.getMonth() + 1)).slice(-2);
        const day = ('0' + dateIST.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }
}


export const PlayActiveIncomingMsg = async () => {
    const { sound } = await Audio.Sound.createAsync(require("@/assets/sounds/active_incoming_msg.mp3"));
    await sound.playAsync();
}

export const PlayIncomingMsg = async () => {
    const { sound } = await Audio.Sound.createAsync(require("@/assets/sounds/incoming_msg.mp3"));
    await sound.playAsync();
}

export const PlayMsgSent = async () => {
    const { sound } = await Audio.Sound.createAsync(require("@/assets/sounds/msg_sent.mp3"));
    await sound.playAsync();
}

  
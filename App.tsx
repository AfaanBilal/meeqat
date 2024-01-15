

/**
 * Meeqat
 *
 * @author Afaan Bilal
 * @link   https://afaan.dev
 *
 * @copyright 2024 Afaan Bilal
 */

import React from "react";
import * as Location from "expo-location";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fonts } from "./src/utils/fonts";
import { Colors } from "./src/utils/colors";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export interface Timings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
}

const METHOD = 15; // Moonsighting Committee Worldwide
const TUNE = "0,2,0,5,1,3,0,-1";

export default function App() {
    const [fontsLoaded] = useFonts({
        [Fonts.SourceSansProLight]: require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Light.ttf"),
        [Fonts.SourceSansPro]: require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf"),
        [Fonts.SourceSansProSemiBold]: require("./assets/fonts/Source_Sans_Pro/SourceSansPro-SemiBold.ttf"),
        [Fonts.SourceSansProBold]: require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf"),

        [Fonts.UbuntuLight]: require("./assets/fonts/Ubuntu/Ubuntu-Light.ttf"),
        [Fonts.Ubuntu]: require("./assets/fonts/Ubuntu/Ubuntu-Regular.ttf"),
        [Fonts.UbuntuMedium]: require("./assets/fonts/Ubuntu/Ubuntu-Medium.ttf"),
        [Fonts.UbuntuBold]: require("./assets/fonts/Ubuntu/Ubuntu-Bold.ttf"),
    });

    const [error, setError] = React.useState("");
    const [date, setDate] = React.useState(new Date());
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [timings, setTimings] = React.useState<Timings>();

    const fetchTimings = async (selectedDate: Date) => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setError("Location permission denied.");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const timings = await fetch(
                `http://api.aladhan.com/v1/calendar/${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&method=${METHOD}&tune=${TUNE}`
            ).then((res) => res.json());

            setTimings(timings.data[selectedDate.getDate() - 1].timings);
        } catch (error) {
            setError("Error fetching timings.");
        }
    };

    React.useEffect(() => {
        fetchTimings(date);
    }, [date]);

    const handlePrevDay = () => {
        const prevDay = new Date(date);
        prevDay.setDate(date.getDate() - 1);
        setDate(prevDay);
    };

    const handleNextDay = () => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        setDate(nextDay);
    };

    const handleDatePress = () => {
        setShowDatePicker(true);
    };

    const handleDateTimeChange = (_: Event, selected: Date | undefined) => {
        if (selected) {
            setDate(selected);
            setShowDatePicker(false);
        }
    };

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.Dark }}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <View style={styles.titleRow}>
                    <Text style={{ ...styles.meeqatItemLabel, ...styles.title }}>Meeqat</Text>
                </View>
                {error && <Text style={{ ...styles.loading, color: Colors.Accent }}>{error}</Text>}
                <View style={styles.datePicker}>
                    <TouchableOpacity onPress={handlePrevDay}>
                        <Feather name="chevron-left" size={25} color={Colors.Light} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDatePress}>
                        <Text style={[styles.dateSelectorText, date.toDateString() === new Date().toDateString() ? styles.currentDayText : null]}>
                            {date.toDateString()} {date.toDateString() === new Date().toDateString() && " (Today)"}
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNextDay}>
                        <Feather name="chevron-right" size={25} color={Colors.Light} />
                    </TouchableOpacity>
                </View>
                {
                    showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="spinner"
                            onChange={handleDateTimeChange}
                        />
                    )}
                {timings ?
                    <View style={styles.timingContainer}>
                        <View style={styles.meeqatItem}>
                            <Text style={styles.meeqatItemLabel}>Fajr</Text>
                            <Text style={styles.meeqatItemValue}>{timings.Fajr}</Text>
                        </View>
                        <View style={styles.meeqatItem}>
                            <Text style={styles.meeqatItemLabel}>Sunrise</Text>
                            <Text style={styles.meeqatItemValue}>{timings.Sunrise}</Text>
                        </View>
                        <View style={styles.meeqatItem}>
                            <Text style={styles.meeqatItemLabel}>Dhuhr</Text>
                            <Text style={styles.meeqatItemValue}>{timings.Dhuhr}</Text>
                        </View>
                        <View style={styles.meeqatItem}>
                            <Text style={styles.meeqatItemLabel}>Asr</Text>
                            <Text style={styles.meeqatItemValue}>{timings.Asr}</Text>
                        </View>
                        <View style={styles.meeqatItem}>
                            <Text style={styles.meeqatItemLabel}>Sunset</Text>
                            <Text style={styles.meeqatItemValue}>{timings.Sunset}</Text>
                        </View>
                        <View style={styles.meeqatItem}>
                            <Text style={styles.meeqatItemLabel}>Maghrib</Text>
                            <Text style={styles.meeqatItemValue}>{timings.Maghrib}</Text>
                        </View>
                        <View style={styles.meeqatItem}>
                            <Text style={styles.meeqatItemLabel}>Isha</Text>
                            <Text style={styles.meeqatItemValue}>{timings.Isha}</Text>
                        </View>
                        <View style={{ flex: 1 }}></View>
                        <View>
                            <Text style={styles.copyright}>&copy; Afaan Bilal (afaan.dev)</Text>
                        </View>
                    </View> :
                    <Text style={styles.loading}>Loading...</Text>
                }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Dark,
        gap: 12,
        padding: 16,
        marginTop: 25,
    },
    titleRow: {
        flexDirection: "row",
        gap: 5,
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "baseline",
        padding: 16,
    },
    title: {
        fontSize: 36,
        fontFamily: Fonts.SourceSansProBold,
        color: Colors.Light,
    },
    date: {
        fontSize: 24,
        fontFamily: Fonts.SourceSansPro,
        color: Colors.Light,
    },
    datePicker: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20
    },
    dateSelectorText: {
        textAlign: "center",
        color: "white",
        fontSize: 16,
    },
    currentDayText: {
        color: Colors.ORANGE,
        fontSize: 16,
    },
    loading: {
        textAlign: "center",
        fontSize: 24,
        marginTop: 40,
        fontFamily: Fonts.Ubuntu,
        color: Colors.Gray,
    },
    timingContainer: {
        marginTop: 35,
    },
    meeqatItem: {
        flexDirection: "row",
        gap: 5,
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "baseline",
        padding: 16,
        borderColor: Colors.Gray,
        borderWidth: 0.5,
        borderRadius: 10,
    },
    meeqatItemLabel: {
        flex: 1,
        fontSize: 18,
        color: Colors.Light,
        fontFamily: Fonts.Ubuntu,
    },
    meeqatItemValue: {
        flex: 1,
        fontSize: 18,
        color: Colors.Light,
        textAlign: "right",
        fontFamily: Fonts.UbuntuBold,
    },
    copyright: {
        color: Colors.Gray,
        textAlign: "center",
        fontFamily: Fonts.SourceSansPro,
        fontSize: 18,
    },
});

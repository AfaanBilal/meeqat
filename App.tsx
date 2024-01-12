/**
 * Meeqat
 *
 * @author Afaan Bilal
 * @link   https://afaan.dev
 *
 * @copyright 2023 Afaan Bilal
 */

import React from 'react';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

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

export default function App() {
    const [location, setLocation] = React.useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [timings, setTimings] = React.useState<Timings>();

    React.useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            console.log(location);

            const year = new Date().getFullYear();
            const month = new Date().getMonth() + 1;

            const timings = await (await fetch(`http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&method=15&tune=0,2,0,5,1,3,0,-1`)).json();
            console.log(JSON.stringify(timings.data[new Date().getDate() - 1]));

            setTimings(timings.data[new Date().getDate() - 1].timings);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.meeqatItem}>
                <Text style={{ ...styles.meeqatItemLabel, ...styles.title }}>Meeqat</Text>
                <Text style={{ ...styles.meeqatItemValue, ...styles.date }}>{new Date().toDateString()}</Text>
            </View>
            {errorMsg && <Text style={styles.title}>{errorMsg}</Text>}
            {timings ?
                <>
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
                </> :
                <Text>Loading...</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    title: {
        fontSize: 32,
    },
    date: {
        fontSize: 22,
    },
    meeqatItem: {
        flexDirection: 'row',
        gap: 5,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        borderColor: '#cccccc',
        borderBottomWidth: 1,
        padding: 24,
    },
    meeqatItemLabel: {
        flex: 1,
        fontSize: 18,
        color: '#eee',
    },
    meeqatItemValue: {
        flex: 1,
        fontSize: 18,
        color: '#fff',
        textAlign: 'right',
    },
});

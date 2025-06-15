import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  NativeModules,
} from 'react-native';
import {StatusBar} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
const {WhispererModule} = NativeModules;

const ORANGE = '#FFA726';

export default function RecorderScreen() {
  useEffect(() => {
    handleRecording();
  }, []);

  const handleRecording = async () => {
    let response = await WhispererModule.loadModel(modelPath);
    console.log('response', response);
  };
  const getWhispererModule = () => NativeModules.WhispererModule;
  console.log('getWhispererModule', getWhispererModule());

  const modelPath = RNFS.DocumentDirectoryPath + 'ggml-base.en.bin';

  console.log('modelPath', modelPath);
  const [permission, setPermission] = useState<
    'granted' | 'denied' | 'blocked' | 'unavailable' | 'loading'
  >('loading');

  useEffect(() => {
    const checkPermission = async () => {
      let perm = Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      });
      if (!perm) {
        setPermission('unavailable');
        return;
      }
      const result = await check(perm);
      if (result === RESULTS.GRANTED) {
        setPermission('granted');
      } else if (result === RESULTS.DENIED) {
        const req = await request(perm);
        if (req === RESULTS.GRANTED) {
          setPermission('granted');
        } else if (req === RESULTS.BLOCKED) {
          setPermission('blocked');
        } else {
          setPermission('denied');
        }
      } else if (result === RESULTS.BLOCKED) {
        setPermission('blocked');
      } else {
        setPermission('denied');
      }
    };
    checkPermission();
  }, []);

  if (permission === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={ORANGE} barStyle="light-content" />
        <View style={styles.centerContent}>
          <Text>Checking microphone permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (permission === 'denied') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={ORANGE} barStyle="light-content" />
        <View style={styles.centerContent}>
          <Text style={{color: 'red', fontSize: 18, textAlign: 'center'}}>
            Microphone permission is required to record audio.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (permission === 'blocked') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={ORANGE} barStyle="light-content" />
        <View style={styles.centerContent}>
          <Text
            style={{
              color: 'red',
              fontSize: 18,
              textAlign: 'center',
              marginBottom: 16,
            }}>
            Microphone permission is blocked. Please enable it in settings.
          </Text>
          <TouchableOpacity
            style={styles.markButton}
            onPress={() => openSettings()}>
            <Text style={styles.markButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (permission === 'unavailable') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={ORANGE} barStyle="light-content" />
        <View style={styles.centerContent}>
          <Text style={{color: 'red', fontSize: 18, textAlign: 'center'}}>
            Microphone permission is unavailable on this device.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission granted, show the recorder UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={ORANGE} barStyle="light-content" />
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Recording</Text>
        <View style={styles.eyeIcon}>
          {/* Simple eye icon using SVG-like shapes */}
          <View style={styles.eyeOuter}>
            <View style={styles.eyeInner} />
          </View>
        </View>
      </View>

      {/* Center Content */}
      <View style={styles.centerContent}>
        <Text style={styles.markyTitle}>MARKY</Text>
        <Text style={styles.listeningText}>is listening...</Text>
        {/* Cassette Illustration */}
        <View style={styles.cassetteContainer}>
          <View style={styles.cassetteBody}>
            <View style={styles.cassetteFace}>
              <View style={styles.cassetteReel} />
              <View style={styles.cassetteSmile} />
              <View style={[styles.cassetteReel, {right: 0}]} />
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.stopButton}>
          <Text style={styles.stopButtonText}>STOP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.markButton}>
          <Text style={styles.markButtonText}>MARK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ORANGE,
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topBarText: {color: '#fff', fontSize: 22, fontWeight: '600'},
  eyeIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeOuter: {
    width: 24,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markyTitle: {fontSize: 32, fontWeight: 'bold', marginBottom: 8},
  listeningText: {fontSize: 16, color: '#aaa', marginBottom: 24},
  cassetteContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cassetteBody: {
    width: 120,
    height: 70,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#222',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#aaa',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cassetteFace: {
    position: 'absolute',
    top: 20,
    left: 15,
    right: 15,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cassetteReel: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#222',
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  cassetteSmile: {
    position: 'absolute',
    left: 24,
    top: 10,
    width: 32,
    height: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#222',
    borderRadius: 10,
    transform: [{rotate: '5deg'}],
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  stopButton: {
    borderColor: ORANGE,
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 36,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  stopButtonText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 18,
  },
  markButton: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 36,
    marginLeft: 10,
  },
  markButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {WebView} from 'react-native-webview';

import {homeInsets, homePalette} from '../features/home/theme';

interface HighwayCodeScreenProps {
  onBack: () => void;
}

// Drive's download endpoint can return an HTML confirmation page instead of
// PDF bytes. The preview endpoint serves the document in Drive's PDF viewer.
const HIGHWAY_CODE_PDF_URL =
  'https://drive.google.com/file/d/1aJWkFOwDcO3K7pFgpjXyzV5tGWiq7v1k/preview';

function HighwayCodeScreen({
  onBack,
}: HighwayCodeScreenProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={homePalette.heroStart}
      />

      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <MaterialIcons
              name="arrow-back"
              size={22}
              color={homePalette.white}
            />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text numberOfLines={1} style={styles.title}>
            Highway Code
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.viewerShell}>
          <View style={styles.viewerHeader}>
            <Text style={styles.viewerTitle}>Official PDF</Text>
            <Text style={styles.viewerHint}>Pinch to zoom and scroll</Text>
          </View>

          <View style={styles.pdfWrap}>
            <WebView
              source={{uri: HIGHWAY_CODE_PDF_URL}}
              style={styles.webView}
              javaScriptEnabled
              domStorageEnabled
              onLoadEnd={() => {
                setIsLoading(false);
              }}
              onError={event => {
                setIsLoading(false);
                setLoadError(
                  event.nativeEvent.description ||
                    'The Highway Code PDF could not be loaded.',
                );
              }}
              onHttpError={event => {
                if (event.nativeEvent.statusCode >= 400) {
                  setIsLoading(false);
                  setLoadError(
                    'Google Drive could not open this file. Check that it is shared with anyone who has the link.',
                  );
                }
              }}
            />

            {isLoading ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={homePalette.navy} />
                <Text style={styles.loadingText}>Loading Highway Code PDF...</Text>
              </View>
            ) : null}

            {loadError ? (
              <View style={styles.errorOverlay}>
                <MaterialIcons
                  name="picture-as-pdf"
                  size={34}
                  color={homePalette.accent}
                />
                <Text style={styles.errorTitle}>Unable to load PDF</Text>
                <Text style={styles.errorText}>{loadError}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: homePalette.heroStart,
    paddingTop: 40
  },
  screen: {
    flex: 1,
    backgroundColor: homePalette.background,
  },
  header: {
    backgroundColor: homePalette.heroStart,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 86,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: homePalette.white,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 6,
  },
  title: {
    flex: 1,
    color: homePalette.white,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 8,
  },
  headerSpacer: {
    width: 86,
  },
  viewerShell: {
    flex: 1,
    marginTop: -4,
    backgroundColor: homePalette.shell,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: homeInsets.bottomSafeInset,
  },
  viewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  viewerTitle: {
    color: homePalette.ink,
    fontSize: 17,
    fontWeight: '800',
  },
  viewerHint: {
    color: homePalette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  pdfWrap: {
    flex: 1,
    backgroundColor: '#D6DEE6',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D3DBE3',
  },
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#D6DEE6',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,253,248,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: homePalette.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,253,248,0.98)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: homePalette.ink,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    color: homePalette.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});

export default HighwayCodeScreen;

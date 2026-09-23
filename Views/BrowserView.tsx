import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  Share,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { BottomBarIconProps } from "../types";
import BottomBarIcon from "../Components/BottomBarIcon";

const BrowserView: React.FC = () => {
  const [url, setUrl] = useState("https://www.google.com");
  const [currentUrl, setCurrentUrl] = useState(url);
  const webViewRef = useRef<WebView>(null);

  const handleLoadUrl = () => {
    // validate URL: add https:// if the user left it out
    let newUrl = url.trim();
    if (!newUrl.startsWith("http")) {
      newUrl = `https://${newUrl}`;
    }
    setUrl(newUrl);
    setCurrentUrl(newUrl);
  };

  const handleBack = () => {
    webViewRef.current?.goBack();
  };

  const handleForward = () => {
    webViewRef.current?.goForward();
  };

  const handleShare = async () => {
    try {
      await Share.share(
        Platform.OS === "ios" ? { url: url } : { message: url }
      );
    } catch (error) {
      console.log("Share failed", error);
    }
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  const handleCancel = () => {
    webViewRef.current?.stopLoading();
  };

  // keep the URL bar in sync when the user taps links or goes back/forward
  const handleNavigationChange = (navState: WebViewNavigation) => {
    setUrl(navState.url);
  };

  const actions: BottomBarIconProps[] = [
    { iconName: "arrow-back", size: 24, onPress: handleBack },
    { iconName: "arrow-forward", size: 24, onPress: handleForward },
    {
      iconName: Platform.OS === "ios" ? "share-outline" : "share-social",
      size: 24,
      onPress: handleShare,
    },
    { iconName: "refresh", size: 24, onPress: handleRefresh },
    { iconName: "close", size: 24, onPress: handleCancel },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.urlBar}>
        <Text style={styles.label}>URL:</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          keyboardType="url"
          returnKeyType="go"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleLoadUrl}
        />
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        onNavigationStateChange={handleNavigationChange}
      />
      <View style={styles.bottomBar}>
        {actions.map((action, index) => (
          <BottomBarIcon key={index} {...action} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  urlBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
    position: "relative",
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    position: "absolute",
    left: 20,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 7,
    marginRight: 8,
    paddingLeft: 55,
    opacity: 0.8,
  },
  iconButton: {
    padding: 4,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
  },
});

export default BrowserView;

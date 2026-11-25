import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text } from 'react-native';
import SectionTransition from './src/components/SectionTransition';
import { DarkTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import PlaceDetailScreen from './src/screens/PlaceDetailScreen';
import Map3DScreen from './src/screens/Map3DScreen';
import RemindersSync from './src/components/RemindersSync';
import WhatsAppFab from './src/components/WhatsAppFab';
import ClubDetailScreen from './src/screens/ClubDetailScreen';
import RequestScreen from './src/screens/RequestScreen';
import InfoScreen from './src/screens/InfoScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import ArtistScreen from './src/screens/ArtistScreen';
import PlanScreen from './src/screens/PlanScreen';
import AskScreen from './src/screens/AskScreen';
import NewsStoryScreen from './src/screens/NewsStoryScreen';
import StaysScreen from './src/screens/StaysScreen';
import ItinerariesScreen from './src/screens/ItinerariesScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import StandardScreen from './src/screens/StandardScreen';
import LuxuryScreen from './src/screens/LuxuryScreen';
import StayDetailScreen from './src/screens/StayDetailScreen';
import { StoreProvider } from './src/store';
import { ContentProvider } from './src/content';
import { Icon, IconName } from './src/components/Icon';
import { useT } from './src/i18n';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, border: colors.border, primary: colors.brand, text: colors.text },
};

function Tabs() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const icon = (name: IconName) => ({ color }: { color: string }) => <Icon name={name} size={22} color={color} />;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        tabBarLabelPosition: 'below-icon',
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.bg, paddingTop: insets.top },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabHome'), headerShown: false, tabBarIcon: icon('home') }} />
      <Tab.Screen name="Products" component={ProductsScreen} options={{ title: t('tabProducts'), headerShown: false, tabBarIcon: icon('concierge') }} />
      {/* Explore resta raggiungibile (Prodotti → Standard) ma fuori dalla barra: 6 voci, non 7. */}
      <Tab.Screen name="Clubs" component={ExploreScreen} options={{ title: t('tabClubs'), headerShown: false, tabBarIcon: icon('clubs'), tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="Map3D" component={Map3DScreen} options={{ title: t('tabMap'), headerShown: false, tabBarIcon: icon('map') }} />
      <Tab.Screen name="Ask" component={AskScreen} options={{ title: t('tabAsk'), headerShown: false, tabBarIcon: icon('ask') }} />
      <Tab.Screen name="Plan" component={PlanScreen} options={{ title: t('tabPlan'), headerShown: false, tabBarIcon: icon('plan') }} />
      <Tab.Screen name="Request" component={RequestScreen} options={{ title: t('tabRequest'), headerShown: false, tabBarIcon: icon('request') }} />
    </Tab.Navigator>
  );
}

// Pagine con testata a tutto schermo: intestazione trasparente e tasto indietro come cerchio scuro.
function HeroBack({ onPress }: { onPress: () => void }) {
  const t = useT();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={onPress} hitSlop={10} style={({ pressed }) => [heroBtn, pressed && { opacity: 0.7 }]}>
      <Text style={{ color: '#FFFFFF', fontSize: 28, lineHeight: 30, marginTop: -3, marginLeft: -2 }}>‹</Text>
    </Pressable>
  );
}
const heroBtn = { width: 44, height: 44, borderRadius: 22, marginLeft: 8, backgroundColor: 'rgba(5,6,7,0.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', alignItems: 'center' as const, justifyContent: 'center' as const };
const heroHeader = ({ navigation }: any) => ({
  title: '',
  headerTransparent: true,
  headerStyle: { backgroundColor: 'transparent' },
  headerLeft: () => (navigation.canGoBack() ? <HeroBack onPress={() => navigation.goBack()} /> : null),
});

export default function App() {
  const t = useT();
  const navRef = useNavigationContainerRef();
  const [route, setRoute] = useState<string | undefined>('Home');
  const sync = () => setRoute((navRef as any).getCurrentRoute()?.name);
  return (
    <SafeAreaProvider>
      <ContentProvider>
      <StoreProvider>
      <RemindersSync />
      <NavigationContainer theme={navTheme} ref={navRef} onReady={sync} onStateChange={sync}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={({ navigation }) => ({
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.brand,
            headerTitleStyle: { color: colors.text },
            headerShadowVisible: false,
            headerBackVisible: false,
            headerLeft: () =>
              navigation.canGoBack() ? (
                <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => navigation.goBack()} hitSlop={12} style={{ paddingLeft: 8 }}>
                  <Text style={{ color: colors.brand, fontSize: 32, lineHeight: 34, paddingRight: 12 }}>‹</Text>
                </Pressable>
              ) : null,
          })}
        >
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="ClubDetail" component={ClubDetailScreen} options={heroHeader} />
          <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ title: '' }} />
          <Stack.Screen name="Itineraries" component={ItinerariesScreen} options={{ title: '' }} />
          <Stack.Screen name="Standard" component={StandardScreen} options={{ title: '' }} />
          <Stack.Screen name="Luxury" component={LuxuryScreen} options={{ title: '', headerStyle: { backgroundColor: '#030303' }, headerTintColor: '#D9B96E' }} />
          <Stack.Screen name="Stays" component={StaysScreen} options={{ title: '' }} />
          <Stack.Screen name="StayDetail" component={StayDetailScreen} options={{ title: '' }} />
          <Stack.Screen name="Request" component={RequestScreen} options={{ title: '' }} />
          <Stack.Screen name="Info" component={InfoScreen} options={{ title: '' }} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} options={heroHeader} />
          <Stack.Screen name="Artist" component={ArtistScreen} options={{ title: '' }} />
          <Stack.Screen name="NewsStory" component={NewsStoryScreen} options={{ title: '' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <WhatsAppFab route={route} />
      <SectionTransition route={route} />
      </StoreProvider>
      </ContentProvider>
    </SafeAreaProvider>
  );
}

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

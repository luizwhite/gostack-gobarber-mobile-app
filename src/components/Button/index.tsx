import React from 'react';
import { View } from 'react-native';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  children: string;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container {...rest}>
    <View accessible>
      <ButtonText>{children}</ButtonText>
    </View>
  </Container>
);

export default Button;

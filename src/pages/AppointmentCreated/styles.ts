import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  margin-top: 48px;

  color: #f4ede8;
  font-size: 32px;
  font-family: 'RobotoSlab-Medium';
  text-align: center;
`;

export const Description = styled.Text`
  margin-top: 16px;

  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #999591;
  text-align: center;
`;

export const OkButton = styled(RectButton)`
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding: 12px 24px;

  background-color: #ff9000;
  border-radius: 10px;
`;

export const OkButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #312e38;
  font-size: 18px;
`;

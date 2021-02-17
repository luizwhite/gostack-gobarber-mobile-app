import styled, { css } from 'styled-components/native';
import { FlatList, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RectButton } from 'react-native-gesture-handler';

import { Provider } from './index';

interface ProviderContainerProps {
  selected: boolean;
}

interface ProviderNameProps {
  selected: boolean;
}

interface HourProps {
  available: boolean;
  selected: boolean;
}

interface HourTextProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  ${Platform.OS === 'ios' &&
  css`
    padding-top: ${getStatusBarHeight() + 24}px;
  `}

  background-color: #28262e;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  margin-left: 16px;

  color: #f5ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
`;

export const UserAvatar = styled.Image`
  margin-left: auto;
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const Content = styled.ScrollView``;

export const ProvidersListContainer = styled.View`
  height: 112px;
`;

export const ProvidersList = styled(
  FlatList as new () => FlatList<Provider>,
).attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
})``;

export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  margin-right: 16px;

  border-radius: 10px;
  background-color: ${({ selected }) => (selected ? '#ff9000' : '#3e3b47')};
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderName = styled.Text<ProviderNameProps>`
  margin-left: 8px;
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  color: ${({ selected }) => (selected ? '#232129' : '#f4ede8')};
`;

export const Calendar = styled.View``;

export const Title = styled.Text`
  margin: 0 24px 24px;

  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
`;

export const OpenDatePickerButton = styled(RectButton)`
  align-items: center;
  justify-content: center;
  height: 46px;
  margin: 0 24px;

  border-radius: 10px;
  background-color: #ff9000;
`;
export const OpenDatePickerButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  color: #232129;
`;

export const Schedule = styled.View`
  padding: 24px 0 16px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
  margin: 0 24px 12px;

  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  color: #999591;
`;

export const SectionContent = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingHorizontal: 24 },
})``;

export const Hour = styled(RectButton)<HourProps>`
  padding: 12px;
  margin-right: 8px;

  background-color: ${({ selected }) => (selected ? '#ff9000' : '#3e3b47')};
  border-radius: 10px;

  opacity: ${({ available }) => (available ? 1 : 0.3)};
`;

export const HourText = styled.Text<HourTextProps>`
  color: ${({ selected }) => (selected ? '#232129' : '#f4ede8')};
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
`;

export const CreateAppointmentButton = styled(RectButton)`
  align-items: center;
  justify-content: center;
  height: 54px;
  margin: 0 24px 24px;

  border-radius: 10px;
  background-color: #ff9000;
`;

export const CreateAppointmentButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  color: #232129;
`;

import styled from 'styled-components/native';

export const Container = styled.View<{ keyboardShown: boolean }>`
  flex: 1;
  justify-content: center;
  padding: 0 30px 50px 30px;
`;

export const Title = styled.Text<{ keyboardShown: boolean }>`
  width: 100%;
  margin: 24px 0 24px;

  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  text-align: left;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 20px;

  position: absolute;
  top: 64px;
  z-index: 10;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin: 0 auto;
`;

export const UserAvatar = styled.Image`
  align-self: center;
  margin-top: 64px;
  width: 186px;
  height: 186px;

  border-radius: 98px;
`;

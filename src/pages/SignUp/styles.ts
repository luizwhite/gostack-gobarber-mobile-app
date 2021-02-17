import styled, { css } from 'styled-components/native';

export const Container = styled.View<{ keyboardShown: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px 50px 30px;
`;

export const Title = styled.Text<{ keyboardShown: boolean }>`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 64px 0 24px;

  ${({ keyboardShown }) =>
    keyboardShown &&
    css`
      margin-top: 0;
    `}
`;

export const BackToSignIn = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background: #312e38;
  border-top-width: 1px;
  border-color: #232129;
  padding: 16px 0;

  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const BackToSignInText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 16px;
`;

/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

import logoImg from '../../assets/logo.png';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const { signIn } = useAuth();

  const [keyboardShown, setKeyboardShown] = useState(false);

  const keyboardShownSet = useCallback(() => {
    setKeyboardShown(true);
  }, []);

  const keyboardShownUnset = useCallback(() => {
    setKeyboardShown(false);
  }, []);

  const cleanUp = useCallback(() => {
    Keyboard.removeListener('keyboardDidShow', keyboardShownSet);
    Keyboard.removeListener('keyboardDidHide', keyboardShownUnset);
  }, [keyboardShownSet, keyboardShownUnset]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardShownSet);
    Keyboard.addListener('keyboardDidHide', keyboardShownUnset);

    // cleanup function
    return cleanUp;
  }, [keyboardShownSet, keyboardShownUnset, cleanUp]);

  // formRef.current?.setFieldValue('email', 'Teste');

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório!')
            .email('Digite um e-mail válido!'),
          password: Yup.string().required('Senha obrigatória!'),
        });

        await schema.validate(data, { abortEarly: false });

        const { email, password } = data;
        await signIn({ email, password });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        } else console.log(err);

        Alert.alert(
          'Erro na autenticação!',
          'Ocorreu um erro ao fazer login, cheque as credenciais.',
        );
      }
    },
    [signIn],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollView}
        >
          <Container keyboardShown={keyboardShown}>
            {!keyboardShown && <Image source={logoImg} />}

            <View>
              <Title keyboardShown={keyboardShown}>Faça seu login</Title>
            </View>

            <Form
              style={styles.widthFull}
              ref={formRef}
              onSubmit={handleSignIn}
            >
              <Input
                name="email"
                icon="mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="E-mail"
                blurOnSubmit={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                secureTextEntry
                placeholder="Senha"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Entrar
              </Button>
            </Form>

            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton
        activeOpacity={1}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma Conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};
export default SignIn;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  widthFull: {
    width: '100%',
  },
});

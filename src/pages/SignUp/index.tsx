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
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

import logoImg from '../../assets/logo.png';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

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

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório!'),
          email: Yup.string()
            .required('E-mail obrigatório!')
            .email('Digite um e-mail válido!'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos!'),
        });

        await schema.validate(data, { abortEarly: false });
        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado!',
          'Vocè já pode fazer seu login no GoBarber.',
        );

        navigation.navigate('SignIn');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          Alert.alert(
            'Erro no cadastro!',
            'Ocorreu um erro ao fazer o cadastro, tente novamente.',
          );
        } else console.log(err);

        Alert.alert('Internal Server Error');
      }
    },
    [navigation],
  );

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardShownSet);
    Keyboard.addListener('keyboardDidHide', keyboardShownUnset);

    // cleanup function
    return cleanUp;
  }, [keyboardShownSet, keyboardShownUnset, cleanUp]);

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
              <Title keyboardShown={keyboardShown}>Crie sua conta</Title>
            </View>
            <Form
              style={styles.widthFull}
              ref={formRef}
              onSubmit={handleSignUp}
            >
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                blurOnSubmit={false}
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />

              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
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
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Entrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn activeOpacity={1} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para login</BackToSignInText>
      </BackToSignIn>
    </>
  );
};
export default SignUp;

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

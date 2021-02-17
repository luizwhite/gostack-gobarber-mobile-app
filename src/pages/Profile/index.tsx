import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
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
import { launchImageLibrary } from 'react-native-image-picker';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
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

  const handleUpdateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape(
          {
            name: Yup.string().required('Nome obrigatório!'),
            email: Yup.string()
              .required('E-mail obrigatório!')
              .email('Digite um e-mail válido!'),
            old_password: Yup.string().when(
              ['password', 'password_confirmation'],
              {
                is: '',
                then: Yup.string(),
                otherwise: Yup.string().required('obrigatório'),
              },
            ),
            password: Yup.string().when('old_password', {
              is: '',
              then: Yup.string(),
              otherwise: Yup.string()
                .min(6, 'No mínimo 6 dígitos!')
                .required('obrigatório'),
            }),
            password_confirmation: Yup.string().when('old_password', {
              is: '',
              then: Yup.string(),
              otherwise: Yup.string()
                .oneOf([Yup.ref('password')], 'Confirmação incorreta')
                .min(6, 'No mínimo 6 dígitos!')
                .required('obrigatório'),
            }),
          },
          [
            ['old_password', 'password'],
            ['old_password', 'password_confirmation'],
          ],
        );

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        /* eslint-disable indent */
        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };
        /* eslint-enable indent */

        const { data: responseData } = await api.put('/profile', formData);
        updateUser(responseData);

        Alert.alert(
          'Perfil atualizado!',
          'Suas informações do perfil foram atualizadas com sucesso!',
        );

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          Alert.alert(
            'Erro ao atualizar informações',
            'Ocorreu um erro ao atualizar as informações do perfil, tente novamente!',
          );
        } else {
          console.log(err);
          Alert.alert('Internal Server Error');
        }
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUpdateAvatar = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxHeight: 186,
        maxWidth: 186,
      },
      ({ didCancel, errorCode, errorMessage, uri, type, fileName }) => {
        if (didCancel) return;

        if (errorCode) {
          Alert.alert(`${errorMessage}`);
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type,
          name: `${user.id}${fileName!.match(/\.[0-9a-z]+$/i)}`,
          uri,
        });

        api.patch('/users/avatar', data).then(({ data: userData }) => {
          updateUser(userData);
        });
      },
    );
  }, [updateUser, user.id]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardShownSet);
    Keyboard.addListener('keyboardDidHide', keyboardShownUnset);

    // cleanup function
    return cleanUp;
  }, [keyboardShownSet, keyboardShownUnset, cleanUp]);

  /* eslint-disable @typescript-eslint/no-use-before-define */
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
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title keyboardShown={keyboardShown}>Meu perfil</Title>
            </View>
            <Form
              initialData={{ name: user.name, email: user.email }}
              style={styles.widthFull}
              ref={formRef}
              onSubmit={handleUpdateProfile}
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
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />

              <Input
                ref={oldPasswordInputRef}
                name="old_password"
                icon="lock"
                secureTextEntry
                placeholder="Senha atual"
                textContentType="password"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                secureTextEntry
                placeholder="Nova senha"
                textContentType="newPassword"
                // eslint-disable-next-line react-native/no-inline-styles
                containerStyle={{ marginTop: 16 }}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              />

              <Input
                ref={confirmPasswordInputRef}
                name="password_confirmation"
                icon="lock"
                secureTextEntry
                placeholder="Confirmar nova senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};
export default Profile;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  widthFull: {
    width: '100%',
  },
});

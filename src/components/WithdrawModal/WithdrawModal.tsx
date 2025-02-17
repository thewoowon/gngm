import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import {useAuth, useMe} from '../../hooks';

const WithdrawModal = ({
  isVisible,
  setIsVisible,
}: {
  // Props here
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {deleteMe} = useMe();
  const {setIsAuthenticated} = useAuth();
  const handleCloseMenu = () => setIsVisible(false);

  const handleWithdraw = async () => {
    const result = await deleteMe();
    if (result) {
      Alert.alert('회원탈퇴가 완료되었습니다.');
    } else {
      Alert.alert('회원탈퇴에 실패했습니다.');
    }
    setIsVisible(false);
    setIsAuthenticated(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={handleCloseMenu}>
        <View style={styles.box}>
          <View style={[styles.flexColumnBox, {gap: 4}]}>
            <Text style={styles.title}>회원탈퇴</Text>
            <Text style={styles.subtitle}>
              정말 이 계정을 삭제하시겠습니까?
            </Text>
          </View>
          <View style={[styles.flexColumnBox, {gap: 8}]}>
            <View style={styles.flexColumnBox}>
              <Text style={styles.description}>
                한 번 계정을 삭제하게 되면 당신의
              </Text>
              <Text style={styles.description}>
                모든 데이터가 삭제되며 복구할 수 없습니다.
              </Text>
            </View>
            <Text style={styles.warning}>이 작업은 되돌릴 수 없습니다.</Text>
          </View>
          <View
            style={[
              styles.flexBox,
              {position: 'relative', gap: 10, marginTop: 4},
            ]}>
            <Pressable
              style={[styles.button, {backgroundColor: '#E8FBF7'}]}
              onPress={handleCancel}>
              <Text style={[styles.buttonText, {color: '#1CD7AE'}]}>취소</Text>
            </Pressable>
            <Pressable
              style={[styles.button, {backgroundColor: '#1CD7AE'}]}
              onPress={handleWithdraw}>
              <Text style={[styles.buttonText, {color: '#FFFFFF'}]}>확인</Text>
            </Pressable>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  box: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 12,
    elevation: 5,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: 600,
    letterSpacing: -0.015,
    lineHeight: 28,
    color: '#1B1B1B',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 24,
    color: '#1B1B1B',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 22,
    color: '#1B1B1B',
  },
  warning: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 22,
    color: '#FF5757',
  },
  button: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: 600,
    letterSpacing: -0.015,
    lineHeight: 16,
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  flexColumnBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WithdrawModal;

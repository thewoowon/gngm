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

const ArticleDetailModal = ({
  isVisible,
  setIsVisible,
  isOwner,
}: {
  // Props here
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isOwner: boolean;
}) => {
  const handleCloseMenu = () => setIsVisible(false);

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={handleCloseMenu}>
        {
          // Other content here
          isOwner ? (
            <View style={styles.menu}>
              <Pressable onPress={() => Alert.alert('Edit selected')}>
                <Text style={styles.menuItem}>수정하기</Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert('Delete selected')}>
                <Text style={styles.menuItem}>삭제하기</Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert('Share selected')}>
                <Text style={styles.menuItem}>공유하기</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.menu}>
              <Pressable onPress={() => Alert.alert('Edit selected')}>
                <Text style={styles.menuItem}>신고하기</Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert('Share selected')}>
                <Text style={styles.menuItem}>공유하기</Text>
              </Pressable>
            </View>
          )
        }
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
  box: {
    width: 200,
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
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
  },
  menu: {
    width: 200,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
});

export default ArticleDetailModal;

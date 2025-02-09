import {Alert, StyleSheet, View} from 'react-native';
import Postcode from '@thewoowon/react-native-daum-postcode';

const CustomPostcode = () => {
  return (
    <View style={styles.container}>
      <Postcode
        style={{width: '100%', height: '100%'}}
        jsOptions={{animation: true}}
        onSelected={(data: any) => Alert.alert(JSON.stringify(data))}
        onError={(error: any) => Alert.alert(JSON.stringify(error))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomPostcode;

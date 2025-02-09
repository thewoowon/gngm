import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Article, User} from '../../types/get';
import DeliveryItem from './DeliveryItem';

type DeliveryViewProps = {
  articles: Article[];
  requests: Article[];
  user: User;
};

function DeliveryView({articles, requests, user}: DeliveryViewProps) {
  return (
    <View style={styles.container}>
      {/* 내가 요청한 전달 */}
      {requests.map((article, index) => {
        return (
          <DeliveryItem
            key={index}
            article={article}
            deliveryType="request"
            userId={user.id}
          />
        );
      })}
      {/* 내가 생성한 전달 */}
      {articles
        .filter(article => article.article_type === 'deliverItTo')
        .map((article, index) => {
          return (
            <DeliveryItem
              key={index}
              article={article}
              deliveryType="article"
              userId={user.id}
            />
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
});

export default DeliveryView;

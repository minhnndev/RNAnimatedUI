import * as React from 'react';
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
const {width, height} = Dimensions.get('screen');
import AntDesign from 'react-native-vector-icons/AntDesign';
import faker from 'faker';

const IMAGE_WIDTH = width * 0.65;
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.7;
const images = [
  'https://images.pexels.com/photos/1799912/pexels-photo-1799912.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1769524/pexels-photo-1769524.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1758101/pexels-photo-1758101.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1738434/pexels-photo-1738434.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1698394/pexels-photo-1698394.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1684429/pexels-photo-1684429.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1690351/pexels-photo-1690351.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1668211/pexels-photo-1668211.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1647372/pexels-photo-1647372.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1616164/pexels-photo-1616164.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1799901/pexels-photo-1799901.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1789968/pexels-photo-1789968.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1774301/pexels-photo-1774301.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1734364/pexels-photo-1734364.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.pexels.com/photos/1724888/pexels-photo-1724888.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
];

faker.seed(10);

const DATA = [...Array(images.length).keys()].map((_, i) => {
  return {
    key: faker.random.uuid(),
    image: images[i],
    title: faker.commerce.productName(),
    subtitle: faker.company.bs(),
    price: faker.finance.amount(80, 200, 0),
  };
});
const SPACING = 20;

const Content = ({item}) => {
  return (
    <>
      <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
        {item.title}
      </Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
      <View style={styles.space}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.unit}>USD</Text>
      </View>
    </>
  );
};

export default () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const progress = Animated.modulo(Animated.divide(scrollX, width), width);
  const [index, setIndex] = React.useState(0);
  console.log(index);
  const ref = React.useRef();
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <SafeAreaView style={{marginTop: SPACING * 4}}>
        <View style={{height: IMAGE_HEIGHT * 2.1}}>
          <Animated.FlatList
            ref={ref}
            data={DATA}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true},
            )}
            bounces={false}
            style={{flexGrow: 0, zIndex: 999}}
            contentContainerStyle={{
              height: IMAGE_HEIGHT + SPACING * 2,
              paddingHorizontal: SPACING * 2,
            }}
            onMomentumScrollEnd={(ev) => {
              setIndex(Math.ceil(ev.nativeEvent.contentOffset.x / width));
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0, 1, 0],
              });
              const translateY = scrollX.interpolate({
                inputRange,
                outputRange: [50, 0, 20],
              });
              return (
                <Animated.View
                  style={{
                    width,
                    paddingVertical: SPACING,
                    opacity,
                    transform: [{translateY}],
                  }}>
                  <Image source={{uri: item.image}} style={styles.imagecover} />
                </Animated.View>
              );
            }}
          />
          <View style={styles.imagespace}>
            {DATA.map((item, index) => {
              const inputRange = [
                (index - 0.3) * width,
                index * width,
                (index + 0.3) * width,
              ];
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0, 1, 0],
              });
              const rotateY = scrollX.interpolate({
                inputRange,
                outputRange: ['45deg', '0deg', '45deg'],
              });
              return (
                <Animated.View
                  key={item.key}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    position: 'absolute',
                    opacity,
                    transform: [{perspective: IMAGE_WIDTH * 4}, {rotateY}],
                  }}>
                  <Content item={item} />
                </Animated.View>
              );
            })}
          </View>
          <Animated.View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: IMAGE_WIDTH + SPACING * 2,
              position: 'absolute',
              backgroundColor: 'white',
              // backfaceVisibility: true,
              zIndex: -1,
              top: SPACING * 2,
              left: SPACING,
              bottom: 0,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 24,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              transform: [
                {
                  perspective: IMAGE_WIDTH * 4,
                },
                {
                  rotateY: progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['0deg', '90deg', '180deg'],
                  }),
                },
              ],
            }}
          />
        </View>
        <View style={styles.arrflat}>
          <TouchableOpacity
            disabled={index === 0}
            style={{opacity: index === 0 ? 0.2 : 1}}
            onPress={() => {
              ref?.current?.scrollToOffset({
                offset: (index - 1) * width,
                animated: true,
              });
            }}>
            <View style={styles.viewbutton}>
              <AntDesign name="swapleft" size={42} color="black" />
              <Text style={styles.textbutton}>PREV</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={index === DATA.length - 1}
            style={{opacity: index === DATA.length - 1 ? 0.2 : 1}}
            onPress={() => {
              ref?.current?.scrollToOffset({
                offset: (index + 1) * width,
                animated: true,
              });
            }}>
            <View style={styles.viewbutton}>
              <Text style={styles.textbutton}>NEXT</Text>
              <AntDesign name="swapright" size={42} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#A5F1FA', flex: 1},
  title: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  subtitle: {fontSize: 12, opacity: 0.4},
  space: {flexDirection: 'row', marginTop: SPACING},
  price: {
    fontSize: 42,
    letterSpacing: 3,
    fontWeight: '700',
    marginRight: 8,
  },
  unit: {
    fontSize: 16,
    lineHeight: 36,
    fontWeight: '700',
    alignSelf: 'flex-end',
  },
  imagecover: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  imagespace: {
    width: IMAGE_WIDTH,
    alignItems: 'center',
    paddingHorizontal: SPACING * 2,
    marginLeft: SPACING * 2,
    zIndex: 99,
  },
  animatedView: {
    width: IMAGE_WIDTH + SPACING * 2,
    position: 'absolute',
    backgroundColor: 'white',
    // backfaceVisibility: true,
    zIndex: -1,
    top: SPACING * 2,
    left: SPACING,
    bottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  arrflat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: IMAGE_WIDTH + SPACING * 4,
    paddingHorizontal: SPACING,
    paddingVertical: SPACING,
  },
  viewbutton: {flexDirection: 'row', alignItems: 'center'},
  textbutton: {fontSize: 12, fontWeight: '700'},
});

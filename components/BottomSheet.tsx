import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constant/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINTS = {
  CLOSED: SCREEN_HEIGHT,
  HALF: SCREEN_HEIGHT * 0.5,
  FULL: 0,
};

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoint?: 'HALF' | 'FULL';
}

export default function BottomSheet({
  visible,
  onClose,
  children,
  title,
  snapPoint = 'HALF',
}: BottomSheetProps) {
  const translateY = useMemo(() => new Animated.Value(SCREEN_HEIGHT), []);
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 100) {
            closeSheet();
          } else {
            resetPosition();
          }
        },
      }),
    []
  );

  const openSheet = useCallback(() => {
    Animated.spring(translateY, {
      toValue: SNAP_POINTS[snapPoint],
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [snapPoint]);

  const closeSheet = useCallback(() => {
    Animated.timing(translateY, {
      toValue: SNAP_POINTS.CLOSED,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  }, [onClose]);

  const resetPosition = useCallback(() => {
    Animated.spring(translateY, {
      toValue: SNAP_POINTS[snapPoint],
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [snapPoint]);

  React.useEffect(() => {
    if (visible) {
      openSheet();
    }
  }, [visible, openSheet]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={closeSheet}
        />
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
              maxHeight: SCREEN_HEIGHT * 0.9,
            },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.dragHandle}>
            <View style={styles.dragIndicator} />
          </View>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeSheet}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={Colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.MODAL_BACKGROUND,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.SHADOW_COLOR,
        shadowOffset: Colors.SHADOW_OFFSET,
        shadowOpacity: Colors.SHADOW_OPACITY,
        shadowRadius: Colors.SHADOW_RADIUS,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dragHandle: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.BORDER,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
}); 
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@react-navigation/native';
import CustomText from '@components/CustomText';
import Strings from '@constants/Strings';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: '5%',
  },
  buttonIcon: {
    flex: 1,
    alignSelf: 'center',
  },
  buttonLabel: {
    flex: 5,
    textAlignVertical: 'center',
  },
  buttonValue: {
    textAlignVertical: 'center',
    textAlign: 'right',
    flex: 3,
  },
});

export default function SettingsButton(props: {
  icon?: string;
  label: string;
  value?: string;
  onPress: () => void;
  backgroundColor?: string;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: props.backgroundColor || colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => props.onPress()}
    >
      <View style={styles.buttonIcon}>
        {props.icon && (
          <FontAwesome
            name={(props.icon as any) || 'default-icon'}
            size={16}
            color={colors.primary}
          />
        )}
      </View>
      <CustomText isBold style={[styles.buttonLabel, { color: colors.text }]}>
        {Strings.WHITESPACE_CHARACTER + props.label}
      </CustomText>
      <CustomText isSecondary style={styles.buttonValue}>
        {props.value && props.value + Strings.WHITESPACE_CHARACTER}
        <FontAwesome name="long-arrow-right" size={16} color={colors.primary} />
      </CustomText>
    </TouchableOpacity>
  );
}
